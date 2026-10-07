import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function getBookDetail(bookId: string) {
  const client = await clientPromise;
  const db = client.db(process.env.DATABASE_NAME);
  const collection = db.collection("books");

  const books = await collection
    .aggregate([
      { $match: { _id: new ObjectId(bookId) } },
      { $addFields: { categoryId: { $toObjectId: "$categoryId" } } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $addFields: { category: { $ifNull: ["$category", null] } } },
      { $project: { categoryId: 0 } },
    ])
    .toArray();

  return books.at(0);
}
