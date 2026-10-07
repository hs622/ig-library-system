"use server";

import { ActionResponse } from "@/lib/action-response";
import clientPromise from "@/lib/mongodb";
import { normaliseText } from "@/lib/normaliseText";
import { CreateBookSchema, IBookSchema, ICreateBookSchema } from "@/types/book.zod";
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
        return ActionResponse({
          statusCode: 409,
          message: "Book already exist!",
        });
      }
    } else
      return ActionResponse({
        statusCode: 500,
        message: "something went wrong.",
      });
  }
};
 
export const CreateBookAction_v2 = async (data: ICreateBookSchema) => {
  try {

    data.publicationYear = Number(data.publicationYear) 

    const parsed = CreateBookSchema.safeParse(data);
    console.log(parsed);

    if (!parsed.success) {
      return ActionResponse({
        errors: { ...parsed.error?.errors },
        message: "validation failed",
        statusCode: 400,
      });
    }

    const { tags, ...rest } = parsed.data;

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("books");

    const now = new Date()

    const document = await collection.insertOne({
      ...rest,
      tags: tags?.length ? tags : [],
      createdAt: now,
      updatedAt: now,
    });

    return ActionResponse({
      message: "book created successfully.",
      statusCode: 201,
      data: { _id: document.insertedId, ...rest },
    });
  } catch (error) {
    console.log("ACTION creating-book", error);
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        return ActionResponse({
          message: "Book already exists, Please check the book title.",
          statusCode: 409,
        });
      }
    }

    return ActionResponse({
      message: "Something went wrong creating the book.",
      statusCode: 500,
    });
  }
};