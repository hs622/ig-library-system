import { calculateAge, cnicRegex, phoneRegex } from "@/lib/hepler";
import { ObjectId } from "mongodb";
import z from "zod";

export const Role = z.enum(["admin", "member", "idle"]);

// ----- Category ----- //

export const CategorySchema = z.object({
  title: z
    .string()
    .min(1, { message: "category is required." })
    .max(150, { message: "Max 150 characters long" }),
  parentId: z.string().optional(),
  isAccosicated: z.boolean(),
  isParent: z.boolean(),
  visiable: z.boolean(),
});

export const SubCategory = z
  .string()
  .min(3, "Must be a valid sub category.")
  .max(150, "Must be less than 150 characters.");

export const AddCategorySchema = z.object({
  category: z
    .string()
    .min(3, "category is required!")
    .max(150, "Must be less than 150 characters."),
  sub_category: z.array(SubCategory).optional(),
});

export const CategoryForm = z.object({
  bookId: z.string(),
  categoryId: z.string(),
});

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
  category: CategorySchema.extend({
    _id: z.string(),
    createdAt: z.string(),
  }),
});

export const BookEditSchema = z.object({
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
  publicationYear: z.preprocess(
    (value) => (value === null || value === undefined ? value : String(value)),
    z
      .string()
      .regex(/^\d{4}$/, "Year must be exactly 4 digits.")
      .transform((val) => parseInt(val, 10))
      .pipe(
        z
          .number()
          .min(1900, "Year must be 1900 or later")
          .max(new Date().getFullYear(), "Year cannot be in future."),
      ),
  ),
  categoryId: z.string().min(1, "Please select the category."),
});

// ------ delete resource dialog ------

export const DeleteConfirmationDialog = z.object({ confirmation: z.string() });

// ------ auth validation form -------

export const LoginSchema = z.object({
  username: z.string().min(1, "please enter the username"),
  password: z.string().min(1, "please enter the password"),
});

// ----- member registration form ------

export const MemberFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
    }),
    dob: z.coerce
      .date({ required_error: "Date of birth is required" })
      .max(new Date(), "Date of birth cannot be in the future"),

    formBNumber: z.string().optional(),
    cnicNumber: z.string().optional(),

    address: z.string().min(5, "Address is required"),
    jurisdiction: z.string().min(2, "Jurisdiction is required"),
    province: z.string().min(2, "Province is required"),
    city: z.string().min(2, "City is required"),
    contactNumber: z.string().regex(phoneRegex, "Enter a valid contact number"),
    email: z.string().email("Enter a valid email address"),

    emergencyContactName: z.string().min(2, "Name is required"),
    emergencyContactNumber: z.string().regex(phoneRegex, "Enter a valid contact number"),

    highestEducation: z.string().min(2, "Highest education is required"),
    institution: z.string().min(2, "Institution is required"),
    progressDegree: z.string().min(2, "Progress/Degree is required"),
    educationStatus: z.enum(["completed", "anticipated"], {
      required_error: "Please select a status",
    }),
    yearOfCompletion: z.coerce
      .number({ invalid_type_error: "Enter a valid year" })
      .int()
      .min(1950, "Enter a valid year")
      .max(2100, "Enter a valid year"),

    profession: z.string().optional(),
    company: z.string().optional(),
    designation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const age = calculateAge(data.dob);
    if (age === null) return;

    if (age < 18) {
      if (!data.formBNumber || data.formBNumber.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Form B Number is required for junior members",
          path: ["formBNumber"],
        });
      }
    } else {
      if (!data.cnicNumber || !cnicRegex.test(data.cnicNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valid CNIC (12345-1234567-1) is required for senior members",
          path: ["cnicNumber"],
        });
      }
      if (!data.profession || data.profession.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Profession is required for senior members",
          path: ["profession"],
        });
      }
      if (!data.company || data.company.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company is required for senior members",
          path: ["company"],
        });
      }
      if (!data.designation || data.designation.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Designation is required for senior members",
          path: ["designation"],
        });
      }
    }
  });



export type ISubCategory = z.infer<typeof SubCategory>;
export type IAddCategorySchema = z.infer<typeof AddCategorySchema>;
export type ICategoryForm = z.infer<typeof CategoryForm>;

export type TRole = z.infer<typeof Role>;
export type ICategorySchema = z.infer<typeof CategorySchema>;
export type IBookSchema = z.infer<typeof BookSchema>;
export type IBookEditSchema = z.infer<typeof BookEditSchema>;

export type IDeleteConfirmationDialog = z.infer<
  typeof DeleteConfirmationDialog
>;
export type ILoginSchema = z.infer<typeof LoginSchema>;
export type IMemberFormSchema = z.infer<typeof MemberFormSchema>;

