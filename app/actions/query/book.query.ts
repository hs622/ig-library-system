"use server";

import clientPromise from "@/lib/mongodb";
import { IBookSchema } from "@/types/book.zod";
import { ObjectId, Filter, Document } from "mongodb";

type QueryProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type IBookSchemaWithFewCategoryFields = Omit<IBookSchema, "category"> & {
  category: string;
};

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Helper: params can be string | string[] | undefined — normalize to string
function asString(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() || undefined;
}

export const Book = async ({
  searchParams,
}: QueryProps): Promise<ActionResponse<string>> => {
  const resolvedParams = await searchParams;
  const bookId = asString(resolvedParams["bookId"]);
  const project = asString(resolvedParams["select"]);

  if (!bookId && !ObjectId.isValid(bookId as string)) {
    return {
      success: false,
      error: "Invalid Book ID.",
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection<IBookSchemaWithFewCategoryFields>("books");

    const pipeline: Document[] = [];
    const filter: Filter<Record<string, unknown>> = {};
    const project_parent: Document[] = [];
    const project_child: Document[] = [];

    if (bookId) {
      if (!ObjectId.isValid(bookId)) {
        return { success: false, error: "Invalid bookId" };
      }
      filter._id = new ObjectId(bookId);
    }

    if (project) {
      const fields = project.split(",").map((v) => v.trim());

      const parent_fields = fields
        .filter((field) => !field.includes("."))
        .map<string>((field) => field);

      const child_has_fields = fields
        .filter((field) => field.includes("."))
        .map<string>((field) => field.split(".").at(-1)!);

      const child_fields =
        child_has_fields && child_has_fields.length >= 1
          ? child_has_fields
              .at(0)
              ?.split("|")
              .map<string>((f) => f)
          : [];

      const projection_child_fields = child_fields?.reduce(
        (acc, field) => {
          acc[field] = 1;
          return acc;
        },
        {} as Record<string, 1>,
      );

      const projection_parent_fields = parent_fields.reduce(
        (acc, field) => {
          acc[field] = 1;
          return acc;
        },
        {} as Record<string, 1>,
      );

      project_parent.push({ $project: projection_parent_fields });
      project_child.push({ $project: projection_child_fields });
    }

    if (filter) pipeline.push({ $match: filter });
    
    pipeline.push({
      $addFields: { categoryId: { $toObjectId: "$categoryId" } },
    });

    if (project_child)
      pipeline.push({
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
          pipeline: [...project_child],
        },
      });
    else
      pipeline.push({
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      });

    pipeline.push({
      $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
    });
    if (project_parent) pipeline.push(...project_parent);

    const bookWithCategory = await collection.aggregate(pipeline).toArray();

    return {
      success: true,
      data: JSON.stringify(bookWithCategory.at(0)),
    };
  } catch (error) {
    console.error("queryBook error:", error);
    return { success: false, error: "Failed to fetch books" };
  }
};

