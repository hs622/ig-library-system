import { ObjectId } from "mongodb";
import z from "zod";

export const Role = z.enum(["admin", "member", "idle"]);

// ----- Category ----- //

export const CategorySchema = z.object({
  title: z
    .string()
    .min(1, { message: "category is required." })
    .max(150, { message: "Max 150 characters long" }),
  parentId: z.string(),
  isAccosicated: z.boolean(),
  isParent: z.boolean(),
  visiable: z.boolean()
});

export const SubCategory = z.string().min(3, "Must be a valid sub category.").max(150, "Must be less than 150 characters.")

export const AddCategorySchema = z.object({
  category: z.string().min(3, "category is required!").max(150, "Must be less than 150 characters."),
  sub_category: z.array(SubCategory).optional()
})

// ----- book ----- //

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

export const LoginSchema = z.object({
  username: z.string().min(1, "please enter the username"),
  password: z.string().min(1, "please enter the password")
})


export type ISubCategory = z.infer<typeof SubCategory>;
export type IAddCategorySchema = z.infer<typeof AddCategorySchema>;

export type TRole = z.infer<typeof Role>;
export type ICategorySchema = z.infer<typeof CategorySchema>;
export type IBookSchema = z.infer<typeof BookSchema>;
export type ILoginSchema = z.infer<typeof LoginSchema>;

