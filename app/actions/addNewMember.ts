"use server";

import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import clientPromise from "@/lib/mongodb";
import { MemberFormSchema } from "@/types/member-form.zod";
import { IMemberFormSchema } from "@/types/zod";
import { formatContactNumber } from "@/lib/hepler";

// Adjust to whatever your actual database name is (or keep it in an env var).
const DB_NAME = process.env.DATABASE_NAME;
const COLLECTION = "users";

export type UserDocument = IMemberFormSchema & {
  _id?: ObjectId;
  role: "member";
  /** uuidv4-generated, library-unique identifier for this member. */
  libraryId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CreateMemberResult =
  | { success: true; insertedId: string; libraryId: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createLibraryMember(
  values: IMemberFormSchema
): Promise<CreateMemberResult> {

  const formattedCNIC = String(values.cnicNumber).replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3');
  values.cnicNumber = formattedCNIC

  const formattedNumber = formatContactNumber(values.contactNumber)
  values.contactNumber = formattedNumber

  const parsed = MemberFormSchema.safeParse(values);


  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<UserDocument>("users");

    collection.createIndex({ email: 1}, { unique: true })

    const now = new Date();
    const libraryId = uuidv4();

    const doc: UserDocument = {
      ...parsed.data,
      role: "member",
      libraryId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const result = await collection.insertOne(doc);

    return {
      success: true,
      insertedId: result.insertedId.toString(),
      libraryId,
    };
  } catch (err) {
    console.error("createLibraryMember failed:", err);
    return {
      success: false,
      error: "Something went wrong while saving the member. Please try again.",
    };
  }
}