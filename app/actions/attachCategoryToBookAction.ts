"use server"

import { ActionResponse } from "@/lib/action-response"
import { ApiError } from "@/lib/api-error"
import getClientPromise from "@/lib/mongodb"
import { CategoryForm } from "@/types/attach-category-form.zod"
import { ICategoryForm } from "@/types/zod"
import { ObjectId } from "mongodb"

export const AttachCategoryAction = async (data: ICategoryForm) => {
  try {
    const parsed = CategoryForm.safeParse(data)
    if (!parsed.success) {
      return ActionResponse({
        message: "validation error",
        statusCode: 400,
        errors: parsed.error.flatten().fieldErrors,
      })
    }

    const { bookId, categoryId } = parsed.data

    if (bookId && !ObjectId.isValid(bookId))
      return ActionResponse({
        message: "Invalid bookId",
        statusCode: 400
      })

    if (categoryId && !ObjectId.isValid(categoryId))
      return ActionResponse({
        message: "Invalid categoryId",
        statusCode: 400
      })

    const client = await getClientPromise
    const db = client.db(process.env.DATABASE_NAME)
    const collection = db.collection("books")

    const doc = await collection.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $set: { categoryId: categoryId } },
      { returnDocument: "after" }
    )

    return ActionResponse({
      data: doc,
      message: "books updated successfully.",
      statusCode: 200
    })
  } catch (error) {
    console.error("[ACTION attaching-category-to-book]", error);
    const apiError = ApiError.fromUnknown(error);
    return ActionResponse({
      errors: apiError.message,
      statusCode: apiError.statusCode ?? 500,
      message: "something went wrong."
    });
  }
}