import z from "zod";

export const CategoryForm = z.object({
  bookId: z.string(),
  categoryId: z.string(),
});