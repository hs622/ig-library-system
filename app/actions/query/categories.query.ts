"use server";

import clientPromise from "@/lib/mongodb";
import { ICategorySchema } from "@/types/category.zod";
import { ObjectId, Filter, Document } from "mongodb";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

type QueryProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function Response<T>(
  data: ActionResponse<T>,
): Promise<ActionResponse<T>> {
  return data;
}

// Helper: params can be string | string[] | undefined — normalize to string
function asString(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() || undefined;
}

export const Categories = async ({
  searchParams,
}: QueryProps): Promise<
  ActionResponse<{
    categories: string;
    nextCursor: string | null;
    hasMore: boolean;
    totalCount: number;
  }>
> => {
  const resolvedParams = await searchParams;
  const cursor = asString(resolvedParams["cursor"]);
  const limit = Math.min(
    Number(asString(resolvedParams["limit"])) || DEFAULT_LIMIT,
    MAX_LIMIT,
  );
  const search = asString(resolvedParams["search"]);
  const project = asString(resolvedParams["select"]);
  const isParent: "child" | "parent" = asString(resolvedParams["type"]) as
    | "child"
    | "parent";
  const sort: "asc" | "desc" = asString(resolvedParams["sort"]) as "asc" | "desc"

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection<ICategorySchema>("categories");

    const filter: Filter<ICategorySchema> = {};
    const projection: Document[] = [];

    // if (categoryId) {
    //   if (!ObjectId.isValid(categoryId)) {
    //     return { success: false, error: "Invalid bookId" };
    //   }
    //   filter._id = new ObjectId(categoryId);
    // }

    if (cursor) {
      if (!ObjectId.isValid(cursor)) {
        return { success: false, error: "Invalid cursor" };
      }
      filter._id = { ...(filter._id as object), $lt: new ObjectId(cursor) };
    }

    if (isParent == "child") filter.isParent = false;
    if (isParent == "parent") filter.isParent = true;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    if (project) {
      const fields = project.split(",").map((f) => f.trim());
      const p = fields.reduce(
        (acc, field) => {
          acc[field] = 1;
          return acc;
        },
        {} as Record<string, 1>,
      );

      projection.push({ $project: p });
    }
 
    const pipeline: Document[] = [];

    if (filter) pipeline.push({ $match: filter })
    if (limit) pipeline.push({ $limit: limit + 1})
    if (sort) pipeline.push({ $sort: { _id: -1 }})
    if (project) pipeline.push(...projection)
    

    // [
    //       { $match: filter }, // where clause.
    //       { $sort: { _id: -1 } }, // for sorting clause.
    //       { $limit: limit + 1 }, // for limited response
    //       // { $addFields: { bookCount: { $size: "$books" } } }, // casting
    //       // {
    //       //   $lookup: {
    //       //     from: "books",
    //       //     localField: "_id",
    //       //     foreignField: "categoryId",
    //       //     as: "books",
    //       //   },
    //       // }, // joining
    //       // { $unwind: { path: "$bookCount", preserveNullAndEmptyArrays: true } }, // preserve in case of null relation.
    //       // { $addFields: { category: "$category._id.$count" } }, // specify field.
    //       { ...projection }, // removing value from the object.
    //     ]

    const [categories, totalCount] = await Promise.all([
      collection.aggregate(pipeline).toArray(),
      collection.countDocuments(),
    ]);

    const hasMore = categories.length > limit;
    const pageBooks = hasMore ? categories.slice(0, limit) : categories;
    const nextCursor = hasMore
      ? pageBooks[pageBooks.length - 1]._id.toString()
      : null;

    return Response({
      success: true,
      data: {
        categories: JSON.stringify(pageBooks),
        nextCursor,
        hasMore,
        totalCount,
      },
    });
  } catch (error) {
    console.error("queryBook error:", error);
    return { success: false, error: "Failed to fetch books" };
  }
};

