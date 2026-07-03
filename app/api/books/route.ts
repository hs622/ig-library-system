// import clientPromise from "@/lib/mongodb";
// import parseInteger from "@/lib/parsing/parseInteger";
// import { NextRequest } from "next/server";
// import { paginatedResponse } from "../_common/helper";
// import { IBookSchema } from "@/types/zod";
// import { Document } from "mongodb";

// const PRIMARY_COLLECTION: string = "books";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);

//   // const BID: string = searchParams.get("bid")
//   const KEY: string = searchParams.get("key") || "";
//   const _SKIP: number = parseInteger(searchParams.get("skip")) || 0;
//   const _LIMIT: number = parseInteger(searchParams.get("limit")) || 10;

//   const client = await clientPromise;
//   const database = client.db(process.env.DATABASE_NAME);
//   const collection = database.collection(PRIMARY_COLLECTION);

//   const cursor = collection.aggregate([
//     {
//       $match: {
//         $or: [
//           { title: { $regex: `^${KEY}`, $options: "i" } },
//           { shortDescription: { $regex: `^${KEY}`, $options: "i" } },
//           { authorName: { $regex: `^${KEY}`, $options: "i" } },
//           { PublisherName: { $regex: `^${KEY}`, $options: "i" } },
//         ],
//       },
//     },
//     { $skip: _SKIP },
//     { $limit: _LIMIT },
//   ]);

//   const allDocumnets = await cursor.toArray();

//   return paginatedResponse<Document>(
//       allDocumnets,
//       _SKIP,
//       _LIMIT,
//   );
// }

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

    if (cursor && !ObjectId.isValid(cursor)) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("books");

    // Build the filter
    const filter: Record<string, unknown> = {};

    if (cursor) {
      // assumes default sort by _id (insertion order / ObjectId timestamp)
      filter._id = { $lt: new ObjectId(cursor) };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
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
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
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

