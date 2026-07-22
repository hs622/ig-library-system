import z from "zod";
import { DateOfBirthSchema } from "./date-of-birth.zod";
import { MemberFormSchema } from "./member-form.zod";
import { LoginSchema } from "./auth/login.zod";
import { DeleteConfirmationDialog } from "./delete-confirmation-form.zod";
import { BookEditSchema } from "./book-edit-form.zod";
import { BookSchema } from "./book.zod";
import { CategorySchema } from "./category.zod";
import { CategoryForm } from "./attach-category-form.zod";
import { AddCategorySchema, AddCategorySchema_v2, SubCategory } from "./add-category-form.zod";
import { BookCreateSchema } from "./add-book-form.zod";
import { MemberSchema } from "./member.zod";
import { DepositSchema } from "./deposit.zod";



export const Role = z.enum(["admin", "member", "idle"]);


// ------------------ types -------------------------------------- //

export type ISubCategory = z.infer<typeof SubCategory>;
export type IAddCategorySchema = z.infer<typeof AddCategorySchema>;
export type IAddCategorySchema_v2 = z.infer<typeof AddCategorySchema_v2>;

export type TRole = z.infer<typeof Role>;
export type ICategoryForm = z.infer<typeof CategoryForm>;
export type ICategorySchema = z.infer<typeof CategorySchema>;
export type IBookSchema = z.infer<typeof BookSchema>;
export type IBookCreateSchema = z.infer<typeof BookCreateSchema>;
export type IBookEditSchema = z.infer<typeof BookEditSchema>;

export type IDeleteConfirmationDialog = z.infer<
  typeof DeleteConfirmationDialog
>;
// export type ILoginSchema = z.infer<typeof LoginSchema>;
export type IDateOfBirthValues = z.infer<typeof DateOfBirthSchema>;

export type IMemberSchema = z.infer<typeof MemberSchema>;
export type IMemberFormSchema = z.infer<typeof MemberFormSchema>;

export type IDepositSchema = z.infer<typeof DepositSchema>;