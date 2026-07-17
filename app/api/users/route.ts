import clientPromise from "@/lib/mongodb";
import { Document, MongoServerError, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  // const mId = searchParams.get("mid");
  const cursor = searchParams.get("cursor")?.trim();
  const search = searchParams.get("search")?.trim();
  const limit = Math.min(
    Number(searchParams.get("limit")) || DEFAULT_LIMIT,
    MAX_LIMIT,
  );
  const rawTags = searchParams.get("tags")?.trim(); // like gender,
  const project = searchParams.get("select")?.trim(); // select statement
  const order = searchParams.get("order")?.trim(); // key,value asc/desc

  if (cursor && !ObjectId.isValid(cursor)) {
    return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
  }

  try {

    // initializing database.
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("users");
  
    //
    const filter: Record<string, unknown> = {};
    const sort: Record<string, unknown> = {};
    const projection: Document[] = [];
    const pipeline: Document[] = [];
  
    if (cursor) {
      filter._id = { $lt: new ObjectId(cursor) };
    }
  
    if (search) {
      filter.$or = { fullName: { $regex: search, $option: "i" } };
    }
  
    if (rawTags) {
      const tagsArray: string[] = Array.isArray(rawTags)
        ? rawTags
        : rawTags // second condition (nested condition)
          ? [rawTags]
          : [];
  
      const activeTags = JSON.stringify(req.nextUrl.search);
  
      // const activeTags: { key: string, value: string }[] = tagsArray.map(str => {
      //   const [key, value] = str.split(":")
      //   return { key, value }
      // })
  
      console.log(activeTags);
    }
  
    // fields selection
    if (project) {
      const fields = project.split(",").map((v) => v.trim());
      const p = fields.reduce(
        (acc, field) => {
          acc[field] = 1;
          return acc;
        },
        {} as Record<string, 1>,
      );
  
      projection.push({ $project: p });
    }
  
    // sorting
    if (order) {
      const orderItems: string[] = order.split(",");
      if (orderItems.length == 2 && (Number(order.at(-1)) == 1 || 2)) {
        const key = orderItems.at(0);
        const condition = Number(orderItems.at(1)) == 1 ? 1 : -1;
        sort.$sort = { key, value: condition };
      } else sort.$sort = { _id: -1 };
    }
  
    if (filter) pipeline.push({ $match: filter });
    if (project) pipeline.push(...projection);
    if (limit) pipeline.push({ $limit: limit + 1 });
    if (order) pipeline.push({ $sort: sort }); // descending by _id
  
    const res = await collection.aggregate(pipeline as Document[]).toArray();

    const hasMore = res.length > limit;
    const items = hasMore ? res.slice(0, limit) : res;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;
  
     return NextResponse.json({
      members: items,
      nextCursor,
      hasMore,
    });

  } catch(error) {

    if (error instanceof MongoServerError) {
      console.log(error.code)
    }

    return NextResponse.json({
      success: false,
      message: "something went wrong.",
      error
    })

  }
}

