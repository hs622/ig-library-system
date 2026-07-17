"use server";

import { ObjectId } from "mongodb";
import { ActionResponse } from "@/lib/action-response";
import clientPromise from "@/lib/mongodb";
import { IAddCategorySchema, IAddCategorySchema_v2 } from "@/types/zod";
import {
  AddCategorySchema,
  AddCategorySchema_v2,
} from "@/types/add-category-form.zod";
import { getBaseUrl } from "@/lib/get-base-url";

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

export const AddCategory_v2 = async (data: IAddCategorySchema_v2) => {
  const parsed = AddCategorySchema_v2.safeParse(data);

  if (!parsed.success) {
    return ActionResponse({
      message: "validation failed.",
      statusCode: 400,
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  // destructuring...
  const { category, type, categoryId } = data;

  // initializing mongo client.
  const client = await clientPromise;
  const db = client.db(process.env.DATABASE_NAME);
  const collection = db.collection("categories");

  // fetching lib-sequence number
  const record = await collection.find().sort({ _id: -1 }).limit(1)
  console.log(record.toArray())

  // creating unique index.
  await collection.createIndex({ title: 1 }, { unique: true });

  // initializing session
  const session = client.startSession();


  try {
    // creating objectId and date.
    const categoryObjectId = new ObjectId();
    const now = new Date();

    await session.withTransaction(async () => {
      if (type && categoryId && !ObjectId.isValid(categoryId)) {
        await collection.insertOne({
          _id: categoryObjectId,
          title: categoryId,
          // lab_number:
          parentId: null,
          isParent: type,
          isAccosciated: !type, // initial always false
          visiable: type,
          createdAt: now,
          updatedAt: now,
        });

        await collection.insertOne({
          _id: new ObjectId(),
          title: category,
          parentId: categoryObjectId,
          isParent: !type,
          isAccosciated: !type, // initial always false
          visiable: type,
          createdAt: now,
          updatedAt: now,
        });
      }

      if (type && categoryId && ObjectId.isValid(categoryId)) {
        await collection.insertOne(
          {
            _id: categoryObjectId,
            title: category,
            parentId: new ObjectId(categoryId),
            isParent: !type,
            isAccosciated: !type, // initial always false
            visiable: true,
            createdAt: now,
            updatedAt: now,
          },
          {
            session,
          },
        );
      }

      if (!type) {
        await collection.insertOne(
          {
            _id: categoryObjectId,
            title: category,
            parentId: null,
            isParent: !type,
            isAccosciated: type, // initial always false
            visiable: !type,
            createdAt: now,
            updatedAt: now,
          },
          {
            session,
          },
        );
      }
    });

    return ActionResponse({
      message: "category created successfully.",
      statusCode: 200,
      data: { id: categoryObjectId.toString() },
    });
  } catch (error) {
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

function increment(initialValue: number | undefined) {
  if (initialValue) {
    return initialValue + 1;
  } else {
  }
}
