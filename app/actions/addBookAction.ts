"use server";

import clientPromise from "@/lib/mongodb";
import { IBookSchema } from "@/types/zod";
import { MongoServerError } from "mongodb";

export const AddBookAction = async (data: IBookSchema): Promise<{ status: boolean, message: string } | undefined> => {

  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);

  const collection = database.collection("books");
  collection.createIndex({ title: 1 }, { unique: true }) // unquie field

  // unicode validation for the Title field.
  data.title.trim().normalize("NFC").toLowerCase()

  try {
    const document = {
      ...data,
      "createdAt": new Date(),
      "updatedAt": new Date(),
      "deletedAt": null
    }
  
    const result = await collection.insertOne(document)
    if(result.acknowledged) {
      return {
        status: true,
        message: "book ingested successfully."
      };
    }
  } catch(error) {
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        return {
          status: false,
          message: "Book already exist!"
        }
      }
    }

    else return {
      status: false,
      message: "something went wrong."
    }
  } 
}