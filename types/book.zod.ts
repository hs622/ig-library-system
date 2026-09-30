import z from "zod";
import { objectStrong } from "./common";
import { CategorySchema } from "./category.zod";

export const BookSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Please enter book title." })
    .max(150, { message: "Max 150 character long." }),
  code: z.string(),
  authorName: z
    .string()
    .min(1, { message: "Please enter author name." })
    .max(100, { message: "Max 100 character long." }),
  shortDescription: z.string().max(300, { message: "Max 300 character long." }).optional(),
  isbn13: z.preprocess((value) => {
    return Number.isNaN(value) ? null : Number(value);
  }, z.number().nullable()),
  isbn10: z.preprocess((value) => {
    return Number.isNaN(value) ? null : Number(value);
  }, z.number().nullable()),
  publisherName: z.string().optional(),
  tags: z
    .array(
      z
        .string()
        .toLowerCase()
        .trim()
        .transform((val) => val.replace(/\s+/g, "-"))
        .pipe(
          z
            .string()
            .regex(
              /^[a-z0-9-]+$/i,
              "Only letters, numbers, and hyphens allowed.",
            ),
        ),
    )
    .optional(),
  categoryId: objectStrong.min(1, "Please select the category."),
  publicationYear: z
    .string()
    .regex(/^\d{4}$/, "Year must be exactly 4 digits.")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(1900, "Year must be 1900 or later")
        .max(new Date().getFullYear(), "Year cannot be in future."),
    )
    .optional(),
});
export const CreateBookSchema = BookSchema;
export const EditBookSchema = BookSchema.extend({
  _id: objectStrong,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const DeleteBookSchema = z.object({
  _id: objectStrong,
});

export type IBookSchema = z.infer<typeof BookSchema>;
export type ICreateBookSchema = z.infer<typeof CreateBookSchema>;
export type IEditBookSchema = z.infer<typeof EditBookSchema>;
export type IDeleteBookSchema = z.infer<typeof DeleteBookSchema>;

// special case
export const InsertBulkBooksSchema = BookSchema
// .omit({ publicationYear: true })
// .extend({ 
//   publicationYear: z.preprocess(
//     (val) => (val === "" || val == null ? undefined : val),
//     z
//       .string()
//       .regex(/^\d{4}$/, "Year must be exactly 4 digits.")
//       .transform((val) => parseInt(val, 10))
//       .pipe(
//         z
//           .number()
//           .min(1900, "Year must be 1900 or later")
//           .max(new Date().getFullYear(), "Year cannot be in future."),
//       )
//       .optional(),
//   ),
// });

export const BookEditWithCategorySchema = BookSchema.extend({
  category: CategorySchema.extend({
    _id: z.string(),
  }),
});

export const TrimmedBookEditWithCategorySchema =
  BookEditWithCategorySchema.extend({
    category: BookEditWithCategorySchema.shape.category.omit({
      createdAt: true,
      isAssociated: true,
      parentId: true,
      updatedAt: true,
      visiable: true,
    }),
  });

export type IInsertBulkBooksSchema = z.infer<typeof InsertBulkBooksSchema>;
export type IBookEditWithCategorySchema = z.infer<
  typeof BookEditWithCategorySchema
>;
export type ITrimmedBookEditWithCategorySchema = z.infer<
  typeof TrimmedBookEditWithCategorySchema
>;
export type IBookTableColumnType = Omit<IEditBookSchema, "updatedAt"> & {
  category: string;
};

