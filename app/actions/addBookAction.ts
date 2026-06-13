"use server";

import clientPromise from "@/lib/mongodb";
import { IBookSchema } from "@/types/zod";

export const AddBook_Action = async (data: IBookSchema) => {
  console.log(data);

  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);

  const collection = database.collection("books");
  collection.createIndex({ title: 1 }, { unique: true }) // unquie field

  const document = {
    ...data,
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "deletedAt": null
  }

  const result = await collection.insertOne(document)
  if(result.acknowledged) {
    return true;
  }

  return false;
}