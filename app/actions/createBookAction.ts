"use server";

import { ActionResponse } from "@/lib/action-response";
import clientPromise from "@/lib/mongodb";
import { normaliseText } from "@/lib/normaliseText";
import { IBookSchema } from "@/types/zod";
import { MongoServerError } from "mongodb";

export const CreateBookAction = async (data: IBookSchema) => {
  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);

  const collection = database.collection("books");
  collection.createIndex({ title: 1 }, { unique: true }); // unquie field

  // unicode validation for the Title field.
  data.title = normaliseText(data.title);

  try {
    const document = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await collection.insertOne(document);
    if (result.acknowledged)
      return ActionResponse({
        message: "book registered successfully.",
        statusCode: 200,
        data: document,
      });
  } catch (error) {
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        return {
          status: false,
          message: "Book already exist!",
        };
      }
    } else
      return {
        status: false,
        message: "something went wrong.",
      };
  }
};
