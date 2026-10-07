"use server";

import { ZodError } from "zod";
import clientPromise from "@/lib/mongodb"; 
import { MongoServerError, ObjectId } from "mongodb";
import { CreateBookSchema, ICreateBookSchema } from "@/types/book.zod";

type ActionResponse<T> =
  | { success: true; data?: T; message: string }
  | { success: false; errors?: string | ZodError; message: string };

export const UpdateBookAction = async (
  bookId: string,
  data: ICreateBookSchema,
): Promise<ActionResponse<ICreateBookSchema>> => {
  
  const parsedBookId = ObjectId.isValid(bookId);
  const parsed = CreateBookSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error?.flatten().fieldErrors as ZodError,
      message: "validation failed",
    };
  }

  if (!parsedBookId) {
    return {
      success: false,
      message: "Invalid book ID.",
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("books");

    const now = new Date();

    await collection.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      {
        $set: {
          ...parsed?.data,
          updatedAt: now,
        },
      },
      { returnDocument: "after" },
    );

    return {
      success: true,
      message: "book updated successfully.",
    };
  } catch (error) {
    console.log("ACRION updating-book", error);
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        return {
          success: false,
          errors: error.cause?.message,
          message: "Book already exist, Please check the book title.",
        };
      }
    }

    return {
      success: false,
      message: "Something went wrong updating the book.",
    };
  }
};

