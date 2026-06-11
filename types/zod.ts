import z from "zod";

export const CategorySchema = z.object({
  category: z
    .string()
    .min(1, { message: "category is required." })
    .max(150, { message: "Max 150 characters long" }),
});

export const BookSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Please enter book title." })
    .max(150, { message: "Max 150 character long." }),
  authorName: z
    .string()
    .min(1, { message: "Please enter author name." })
    .max(100, { message: "Max 100 character long." }),
  shortDescription: z.string().max(300, { message: "Max 300 character long." }),
  isbn13: z.preprocess((value) => {
    return Number.isNaN(value) ? null : Number(value);
  }, z.number().nullable()),
  isbn10: z.preprocess((value) => {
    return Number.isNaN(value) ? null : Number(value);
  }, z.number().nullable()),
  publisherName: z.string().optional(),
  publicationYear: z
    .string()
    .regex(/^\d{4}$/, "Year must be exactly 4 digits.")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(1900, "Year must be 1900 or later")
        .max(new Date().getFullYear(), "Year cannot be in future."),
    ),
  category: z.string(),
});

export type IcategorySchema = z.infer<typeof CategorySchema>;
export type IBookSchema = z.infer<typeof BookSchema>;

