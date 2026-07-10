import z from "zod";
import { DateOfBirthSchema } from "./date-of-birth.zod";
import { MemberFormSchema } from "./member-form.zod";
import { LoginSchema } from "./login-form.zod";
import { DeleteConfirmationDialog } from "./delete-confirmation-form.zod";
import { BookEditSchema } from "./book-edit-form.zod";
import { BookSchema } from "./book.zod";
import { CategorySchema } from "./category.zod";
import { CategoryForm } from "./attach-category-form.zod";
import { AddCategorySchema, SubCategory } from "./add-category-form.zod";



export const Role = z.enum(["admin", "member", "idle"]);


// ------------------ types -------------------------------------- //

export type ISubCategory = z.infer<typeof SubCategory>;
export type IAddCategorySchema = z.infer<typeof AddCategorySchema>;

export type TRole = z.infer<typeof Role>;
export type ICategoryForm = z.infer<typeof CategoryForm>;
export type ICategorySchema = z.infer<typeof CategorySchema>;
export type IBookSchema = z.infer<typeof BookSchema>;
export type IBookEditSchema = z.infer<typeof BookEditSchema>;

export type IDeleteConfirmationDialog = z.infer<
  typeof DeleteConfirmationDialog
>;
export type ILoginSchema = z.infer<typeof LoginSchema>;
export type IMemberFormSchema = z.infer<typeof MemberFormSchema>;
export type IDateOfBirthValues = z.infer<typeof DateOfBirthSchema>;


