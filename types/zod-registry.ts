import z from "zod";
import { BookSchema, CreateBookSchema, DeleteBookSchema, EditBookSchema, InsertBulkBooksSchema } from "./book.zod";

export const schemaRegistry: Record<string, z.ZodTypeAny> = {
  bookSchema: BookSchema,
  createBookSchema: CreateBookSchema, 
  editBookSchema: EditBookSchema,
  deleteBookSchema: DeleteBookSchema,

  bulkBooksInsertSchema: InsertBulkBooksSchema
} as const


export function resolveSchema(collectionName: string): z.ZodTypeAny {
  const schema = schemaRegistry[collectionName];

  if(!schema) {
    throw new Error(
      `No validation schema registered for ${collectionName}`,
    );
  }

  return schema;
}