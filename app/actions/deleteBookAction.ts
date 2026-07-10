"use server";

import { ActionResponse } from "@/lib/action-response";
import clientPromise from "@/lib/mongodb";
import { DeleteConfirmationDialog } from "@/types/delete-confirmation-form.zod";
import { 
  IDeleteConfirmationDialog,
} from "@/types/zod";
import { ObjectId } from "mongodb";
import z from "zod";

export default async function DeleteBookAction(
  data: IDeleteConfirmationDialog & { module: string; resourceId: string },
) {

  // Delete confirmation schema has been amended to parse the upcoming payload.
  const parsed = DeleteConfirmationDialog.extend({
    module: z.string().min(4, "module is required"),
    resourceId: z.string().refine((value) => ObjectId.isValid(value), {
      message: "An invalid resource ID has been provided.",
    }),
  }).safeParse(data);

  if (!parsed.success) {
    return ActionResponse({
      errors: parsed.error.flatten().fieldErrors,
      message: "unprocessable entity.",
      statusCode: 422,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const collection = db.collection(parsed.data.module);

    const collecitonResposne = await collection.findOneAndUpdate(
      { _id: new ObjectId(parsed.data.resourceId) },
      { $set: { deletedAt: new Date() } },
      { returnDocument: "after" },
    );

    return ActionResponse({
      data: collecitonResposne,
      message: "Resource delete successfully.",
      statusCode: 200
    })
  } catch (error) {
    console.log(error);
  }
}

