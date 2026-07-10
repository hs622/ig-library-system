"use server";

import { ObjectId } from "mongodb";
import { ActionResponse } from "@/lib/action-response";
import clientPromise from "@/lib/mongodb";
import { IAddCategorySchema } from "@/types/zod";
import { AddCategorySchema } from "@/types/add-category-form.zod";

export const AddCategory = async (data: IAddCategorySchema) => {
  const parsed = AddCategorySchema.safeParse(data);

  if (!parsed.success) {
    return ActionResponse({
      message: "Validation failed.",
      statusCode: 400,
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { category, sub_category } = parsed.data;

  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);
  const collection = database.collection("categories");

  // Ensure the unique index exists. Ideally this is set up once via a
  // migration script rather than on every request — worth moving out
  // if you already have a migration runner set up for this project.
  await collection.createIndex({ title: 1 }, { unique: true });

  const session = client.startSession();

  try {
    const parentId = new ObjectId();
    const now = new Date();

    const hasSubCategories = !!sub_category && sub_category.length > 0;
    // console.log({ hasSubCategories });

    await session.withTransaction(async () => {
      // Parent category document
      await collection.insertOne(
        {
          _id: parentId,
          title: category,
          parentId: null,
          isParent: true,
          isAccosciated: false,
          visiable: true,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        },
        { session },
      );

      // Sub-category documents, each linked back to the parent
      if (hasSubCategories) {
        const subDocs = sub_category!.map((title) => ({
          _id: new ObjectId(),
          title,
          parentId,
          isParent: false,
          isAccosciated: true,
          visiable: true,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        }));

        await collection.insertMany(subDocs, { session });
      }
    });

    return ActionResponse({
      message: "Category registered successfully.",
      statusCode: 200,
      data: { id: parentId.toString() },
    });
  } catch (error: unknown) {
    // Duplicate title (unique index violation)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return ActionResponse({
        message: "A category with this title already exists.",
        statusCode: 409,
      });
    }

    console.error("AddCategory failed:", error);

    return ActionResponse({
      message: "Failed to register category.",
      statusCode: 500,
    });
  } finally {
    await session.endSession();
  }
};
