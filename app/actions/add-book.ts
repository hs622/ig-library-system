"use server";

import clientPromise from "@/lib/mongodb";
import { IBookSchema } from "@/types/zod";

export const AddBook_Action = async (data: IBookSchema) => {
  console.log(data);

  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);

  const books = database.collection("books");

  const document = {
    ...data,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "deletedAt": null
  }

  const result = await books.insertOne(document)
  if(result.acknowledged) {
    return true;
  }

  return false;
}