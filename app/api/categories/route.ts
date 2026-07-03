import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getClientPromise from "@/lib/mongodb"; // your singleton client pattern
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

    if (cursor && !ObjectId.isValid(cursor)) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }

    const client = await getClientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("categories");

    // Build the filter
    const filter: Record<string, unknown> = {};

    if (cursor) {
      // assumes default sort by _id (insertion order / ObjectId timestamp)
      filter._id = { $lt: new ObjectId(cursor) };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } }
      ];
    }

    // Fetch limit + 1 to know if there's a next page without a second query
    const categories = await collection
      .find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .toArray();

    const hasMore = categories.length > limit;
    const items = hasMore ? categories.slice(0, limit) : categories;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

    return NextResponse.json({
      categories: items,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    const apiError = ApiError.fromUnknown(err);
    return NextResponse.json(
      { error: apiError.message },
      { status: apiError.statusCode ?? 500 },
    );
  }
}

