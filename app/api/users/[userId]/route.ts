import { NextRequest, NextResponse } from "next/server";

// import { type UserProps } from "@/types/props";
import clientPromise from "@/lib/mongodb";
import { Document, MongoServerError, ObjectId } from "mongodb";

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const userId = (await params).userId;
  const searchParams = request.nextUrl.searchParams;

  // const project = searchParams.get("select")?.trim();
  const w = searchParams.get("w")?.trim();

  if (userId && !ObjectId.isValid(userId)) {
    return NextResponse.json({
      error: "invalid user Id",
      status: 400,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("users");

    const pipeline: Document[] = [];

    pipeline.push({
      $match: { _id: new ObjectId(userId) },
    });

    if (w == "finance") {
      pipeline.push(
        {
          $addFields: {
            userIdString: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "userId",
            as: "financialRecords",
          },
        },
        {
          $unwind: {
            path: "$financialRecords.itemsArray",
            preserveNullAndEmptyArrays: true,
          },
        },
      );
    }

    const response = await collection.aggregate(pipeline).toArray();

    return NextResponse.json({
      member: response.at(0),
      message: "member successfully fetched.",
      success: true,
    });
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(error.code);
    }

    return NextResponse.json({
      success: false,
      message: "something went wrong.",
      error,
    });
  }
}

