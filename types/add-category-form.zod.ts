import z from "zod";

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

export const AddCategorySchema_v2 = z.object({
  category: z
    .string()
    .min(3, "category is required!")
    .max(150, "Must be less than 150 characters."),
  type: z.boolean().default(false),
  categoryId: z.string().optional(),
}).superRefine((data, ctx) => {
  if(data.type === true && (!data.categoryId || !data.categoryId.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select parent category.",
      path: ["categoryId"]
    })
  }
});