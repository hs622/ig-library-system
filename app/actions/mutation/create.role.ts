"use server";

import clientPromise from "@/lib/mongodb";
import { RoleFormSchema, type RoleFormValues } from "@/types/role-form.zod";
import { MongoServerError, ObjectId } from "mongodb";

type CreateRoleResponse =
  | { success: true; message: string }
  | { success: false; message: string };

function createSlug(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function createRole(data: RoleFormValues): Promise<CreateRoleResponse> {
  const parsed = RoleFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid role details." };
  }

  const { title, description, level, status, permissionIds } = parsed.data;
  const slug = createSlug(title);
  if (!slug) return { success: false, message: "Enter a title that can produce a valid slug." };

  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);
  const roles = database.collection("roles");
  const permissions = database.collection("permissions");
  const normalizedTitle = title.toLocaleLowerCase();
  const permissionObjectIds = permissionIds.map((id) => new ObjectId(id));

  try {
    await roles.createIndex({ titleNormalized: 1 }, { unique: true, sparse: true });

    const duplicate = await roles.findOne({
      $or: [
        { titleNormalized: normalizedTitle },
        { title: { $regex: `^${escapeRegExp(title)}$`, $options: "i" } },
      ],
    });
    if (duplicate) {
      return { success: false, message: "A role with this title already exists." };
    }

    const matchedPermissionCount = await permissions.countDocuments({
      _id: { $in: permissionObjectIds },
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });
    if (matchedPermissionCount !== new Set(permissionIds).size) {
      return { success: false, message: "One or more selected permissions are no longer available." };
    }

    const roleId = new ObjectId();
    const now = new Date();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await roles.insertOne(
          {
            _id: roleId,
            title,
            titleNormalized: normalizedTitle,
            slug,
            description: description || "",
            level,
            status,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
          },
          { session },
        );

        await permissions.updateMany(
          { _id: { $in: permissionObjectIds } },
          { $addToSet: { role_ids: roleId }, $set: { updatedAt: now } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { success: true, message: "Role created successfully." };
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return { success: false, message: "A role with this title or slug already exists." };
    }

    console.error("[createRole]", error);
    return { success: false, message: "Failed to create role. Please try again." };
  }
}
