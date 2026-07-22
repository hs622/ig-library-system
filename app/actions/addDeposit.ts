"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { ActionResponse } from "@/lib/action-response";
import { IDepositSchema } from "@/types/zod";
import { DepositSchema } from "@/types/initail-depsit-form.zod";

export const AddDeposit = async (data: IDepositSchema) => {
  const parsed = DepositSchema.safeParse(data);

  if (!parsed.success) {
    return ActionResponse({
      statusCode: 400,
      message: "validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { userId, reason, amount } = data;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("payments");

    const now = new Date();

    const result = await collection.insertOne({
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      reason,
      amount,
      createdAt: now,
      updatedAt: now,
    });

    if (!result) {
      return {
        success: false,
        message: "User not found",
      };
    }

    console.log({ result });
    return ActionResponse({
      statusCode: 200,
      message: "fund updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("AddInitialDepsit error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
      statusCode: 500,
    };
  }
};

