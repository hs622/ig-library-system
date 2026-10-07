"use server";

import clientPromise from "@/lib/mongodb";
import { IBookSchema } from "@/types/book.zod";
import { ObjectId, Filter } from "mongodb";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

type QueryProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Helper: params can be string | string[] | undefined — normalize to string
function asString(value: string | string[] | undefined): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v?.trim() || undefined;
}

export const Books = async ({
  searchParams,
}: QueryProps): Promise<
  ActionResponse<{
    books: string;
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
  const author = asString(resolvedParams["author"]);
  const genre = asString(resolvedParams["genre"]);
  // const bookId = asString(resolvedParams["bookId"]);

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection<IBookSchema>("books");

    const filter: Filter<IBookSchema> = {};

    // if (bookId) {
    //   if (!ObjectId.isValid(bookId)) {
    //     return { success: false, error: "Invalid bookId" };
    //   }
    //   filter._id = new ObjectId(bookId);
    // }

    if (cursor) {
      if (!ObjectId.isValid(cursor)) {
        return { success: false, error: "Invalid cursor" };
      }
      filter._id = { ...(filter._id as object), $lt: new ObjectId(cursor) };
    }

    if (author) filter.author = author;
    if (genre) filter.genre = genre;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const [books, totalCount] = await Promise.all([
      collection
        .aggregate([
          { $match: filter }, // where clause.
          { $sort: { _id: -1 } }, // for sorting clause.
          { $limit: limit + 1 }, // for limited response
          { $addFields: { categoryId: { $toObjectId: "$categoryId" } } }, // casting
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          }, // joining
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } }, // preserve in case of null relation.
          { $addFields: { category: "$category.title" } }, // specify field.
          { $project: { categoryId: 0 } }, // removing value from the object.
        ])
        .toArray(),

      collection.countDocuments(),
    ]);

    const hasMore = books.length > limit;
    const pageBooks = hasMore ? books.slice(0, limit) : books;
    const nextCursor = hasMore
      ? pageBooks[pageBooks.length - 1]._id.toString()
      : null;

    return {
      success: true,
      data: {
        books: JSON.stringify(pageBooks),
        nextCursor,
        hasMore,
        totalCount,
      },
    };
  } catch (error) {
    console.error("queryBook error:", error);
    return { success: false, error: "Failed to fetch books" };
  }
};

