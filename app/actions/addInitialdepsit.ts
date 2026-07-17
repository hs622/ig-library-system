"use server";

import { ObjectId } from "mongodb";
import { IInitialDepsitByUser } from "@/components/users/add-users-dialog";
import clientPromise from "@/lib/mongodb";
import { ActionResponse } from "@/lib/action-response";

export const AddInitialDepsit = async (data: IInitialDepsitByUser) => {
  const { userId, amount } = data;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection("users");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $set: {
          initialDeposit: amount,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return ActionResponse({
      statusCode: 200,
      message: "fund updated successfully.",
      data: result._id.toString(),
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
