import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb"; // your singleton client pattern
import { ApiError } from "@/lib/api-error";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const cursor = searchParams.get("cursor"); // last seen _id, base64 or raw hex
    const limit = Math.min(
      Number(searchParams.get("limit")) || DEFAULT_LIMIT,
      MAX_LIMIT,
    );
    const search = searchParams.get("search")?.trim();
    const author = searchParams.get("author")?.trim();
    const genre = searchParams.get("genre")?.trim();
    const bookId = searchParams.get("bookId")?.trim();

    if (cursor && !ObjectId.isValid(cursor)) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("books");

    // Build the filter
    const filter: Record<string, unknown> = {};

    if (bookId && ObjectId.isValid(bookId)) {
      const book = await collection
        .aggregate([
          { $match: { _id: new ObjectId(bookId) } },
          { $addFields: { categoryId: { $toObjectId: "$categoryId" } } },
          { $lookup: { from: "categories", localField: "categoryId",foreignField: "_id", as: "category"} },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
          { $addFields: { category: { $ifNull: ["$category", null] } } },
          { $project: { categoryId: 0 } },
        ])
        .toArray();

      return NextResponse.json({
        book: book.at(0),
      });
    }

    if (cursor) {
      // assumes default sort by _id (insertion order / ObjectId timestamp)
      filter._id = { $lt: new ObjectId(cursor) };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
        // { isbn13: { $regex: search, $options: "i" } },
        { isbn10: { $regex: search, $options: "i" } },
      ];
    }

    if (author) {
      filter.author = { $regex: author, $options: "i" };
    }

    if (genre) {
      filter.genre = genre;
    }

    // Fetch limit + 1 to know if there's a next page without a second query
    const books = await collection
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
      .toArray();

    const hasMore = books.length > limit;
    const items = hasMore ? books.slice(0, limit) : books;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

    return NextResponse.json({
      books: items,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("[GET /api/books]", err);
    const apiError = ApiError.fromUnknown(err);
    return NextResponse.json(
      { error: apiError.message },
      { status: apiError.statusCode ?? 500 },
    );
  }
}

