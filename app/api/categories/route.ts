import { NextRequest, NextResponse } from "next/server";
import { Document, ObjectId } from "mongodb";
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
    const type = searchParams.get("type")?.trim();
    const project = searchParams.get("select")?.trim();
    const order = searchParams.get("order")?.trim();

    if (cursor && !ObjectId.isValid(cursor)) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("categories");

    // Build the filter
    const filter: Record<string, unknown> = {};

    if (cursor) {
      // assumes default sort by _id (insertion order / ObjectId timestamp)
      filter._id = { $lt: new ObjectId(cursor) };
    }

    if (type == "child") filter.isParent = false;
    if (type == "parent") filter.isParent = true;

    const projection: Record<string, 1> = {};
    if (project) {
      const allowedFields = new Set([
        "title",
        "code",
        "parentId",
        "isAssociated",
        "isParent",
        "visiable",
        "createdAt",
        "updatedAt",
      ]);
      const fields = project.split(",").map((field) => field.trim());
      if (fields.some((field) => !allowedFields.has(field))) {
        return NextResponse.json({ error: "Invalid selected field" }, { status: 400 });
      }
      for (const field of fields) projection[field] = 1;
      projection._id = 1;
    }

    const pipeline: Document[] = [
      { $match: filter },
      { $sort: { _id: -1 } },
      { $limit: limit + 1 },
    ];

    if (project) {
      const fields = project.split(",").map((f) => f.trim());
      const projection = fields.reduce(
        (acc, field) => {
          acc[field] = 1;
          return acc;
        },
        {} as Record<string, 1>,
      );

      pipeline.push({ $project: projection });
    }

    // Fetch limit + 1 to know if there's a next page without a second query
    const [categories, totalCount] = await Promise.all([
      collection
        .aggregate(pipeline as Document[])
        .toArray(),
     
      collection.countDocuments()
    ])

    const hasMore = categories.length > limit;
    const items = hasMore ? categories.slice(0, limit) : categories;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

    return NextResponse.json({
      categories: items,
      nextCursor,
      hasMore,
      totalCount,
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
