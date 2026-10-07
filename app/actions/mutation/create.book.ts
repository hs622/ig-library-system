"use server";

import clientPromise from "@/lib/mongodb";
import { CreateBookSchema, ICreateBookSchema } from "@/types/book.zod";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";

type ActionResponse<T> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string; errors?: string | ZodError };

export const addNewBook = async (
  data: ICreateBookSchema,
): Promise<ActionResponse<ICreateBookSchema>> => {
  const parsed = CreateBookSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "form validation failed.",
      errors: parsed.error.flatten().fieldErrors as ZodError,
    };
  }

  try {

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection<ICreateBookSchema>("books");

    // collection.

    return {
      success: true,
      message: "book created successfully.",
    };
  } catch (error) {
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        return {
          success: false,
          message: "database validation failed.",
          errors: error.message
        }
      }
    }

    return {
      success: false,
      message: "something went wrong while creating book."
    }
  }
};

