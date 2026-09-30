"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { ZodError } from "zod";
import { ICategorySchema } from "@/types/category.zod";
import {
  CreateCategoryFormValidation,
  ICreateCategoryFormValidation,
} from "@/types/add-category-form.zod";

type CategorySchema = Omit<ICategorySchema, "parentId"> & { _id: ObjectId, parentId: ObjectId | undefined };

type ActionResponse<T> =
  | { success: true; data: T; message: string; statusCode: number }
  | { success: false; errors: string | ZodError | string; statusCode: number };

export const mutateCategory = async (
  data: ICreateCategoryFormValidation,
): Promise<ActionResponse<string>> => {
  const parsed = CreateCategoryFormValidation.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as ZodError,
      statusCode: 409,
    };
  }

  const { category, code, typeOfCategory, childCategories } = parsed.data;
  code.toUpperCase();

  const client = await clientPromise;
  const db = client.db(process.env.DATABASE_NAME);
  const collection = db.collection<CategorySchema>("categories");

  // creating unique index.
  await collection.createIndex({ title: 1 }, { unique: true });
  await collection.createIndex({ code: 1 }, { unique: true });

  // initializing session
  const session = client.startSession();

  try {
    // creating objectId and date.
    const categoryObjectId = new ObjectId();
    const now = new Date();

    let newCategory: CategorySchema;

    // only parent category
    if (!typeOfCategory) {
      newCategory = {
        _id: categoryObjectId,
        title: category.toLowerCase(),
        code,
        isAssociated: typeOfCategory, // Is associated with child categories?
        visiable: !typeOfCategory,
        isParent: !typeOfCategory,
        parentId: undefined,
        createdAt: now,
        updatedAt: now,
      };

      await collection.insertOne(newCategory);

      return {
        success: true,
        statusCode: 201,
        message: "Category created successfully.",
        data: JSON.stringify(newCategory),
      };
    }

    // Parent category
    const parentCategoryObject = {
      _id: categoryObjectId,
      title: category.toLowerCase(),
      code: "need-to-fix-it",
      isAssociated: typeOfCategory, // Is associated with child categories?
      visiable: typeOfCategory,
      isParent: typeOfCategory,
      parentId: undefined,
      createdAt: now,
      updatedAt: now,
    };

    // child category
    const childCategoriesObject = childCategories.map<CategorySchema>((childCategory) => ({
      _id: new ObjectId(),
      title: childCategory.name.toLowerCase(),
      code: childCategory.code.toUpperCase(),
      isAssociated: !typeOfCategory, // Is associated with books?
      visiable: typeOfCategory,
      isParent: !typeOfCategory,
      parentId: categoryObjectId,
      createdAt: now,
      updatedAt: now,
    }));

    await session.withTransaction(async () => {
      await collection.insertOne(parentCategoryObject, { session });
      await collection.insertMany(childCategoriesObject, { session });
    });

    return {
      success: true,
      statusCode: 201,
      message: "Category created successfully.",
      data: JSON.stringify([parentCategoryObject, ...childCategoriesObject]),
    };
  } catch (error) {
    // Duplicate title (unique index violation)
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return {
        success: false,
        errors: "A category with this title already exists.",
        statusCode: 409,
      };
    }

    return {
      success: false,
      statusCode: 500,
      errors: "Failed to register category.",
    };
  } finally {
    await session.endSession();
  }
};

