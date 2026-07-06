"use server";

import { ActionResponse } from "@/lib/action-response";
import clientPromise from "@/lib/mongodb";
import { BookEditSchema, IBookEditSchema } from "@/types/zod";
import { MongoServerError, ObjectId } from "mongodb";

export const UpdateBookAction = async (data: IBookEditSchema & { _id: string }) => {
  try {
    const { _id, ...rest } = data;
    const parsed = BookEditSchema.safeParse(rest);
    console.log(parsed);

    if (!parsed.success) {
      return ActionResponse({
        errors: { ...parsed.error?.errors },
        message: "validation failed",
        statusCode: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("books");

    const document = await collection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { ...rest, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    return ActionResponse({
      message: "book updated successfully.",
      statusCode: 200,
      data: document,
    });
  } catch (error) {
    console.log("ACRION updating-book", error);
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        return {
          message: "Book already exist, Please check the book title.",
          statusCode: 409,
        };
      }
    }

    return ActionResponse({
      message: "Something went wrong updating the book.",
      statusCode: 500,
    });
  }
};
