import z from "zod";
import { BookSchema } from "./book.zod";

export const BookCreateSchema = BookSchema.extend({
  tags: z.array(z.string()).optional(),
});