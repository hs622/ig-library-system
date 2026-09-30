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
  typeOfCategory: z.boolean().default(false),
  categoryId: z.string().optional(),
  code: z.string(),
});

const ChildCategorySchema = z
  .array(
    z.object({
      name: z.string().trim(),
      code: z.string().trim(),
    }),
  )
  .transform((children) =>
    children.filter((child) => child.name !== "" || child.code !== ""),
  );

export const CreateCategoryFormValidation = z
  .object({
    category: z
      .string()
      .min(3, "category is required!")
      .max(150, "Must be less than 150 characters."),
    typeOfCategory: z.boolean().default(false),
    code: z.string(),
    childCategories: ChildCategorySchema.default([]),
  })
  .superRefine((data, ctx) => {
    if (!data.typeOfCategory) return;

    if (data.childCategories.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["childCategories"],
        message: "At least one child category is required.",
      });

      return;
    }

    const hasEmptyChild = data.childCategories.some(
      (child) => !child.name.trim() || !child.code.trim(),
    );

    if (hasEmptyChild) {
      ctx.addIssue({
        code: "custom",
        path: ["childCategories"],
        message: "Please complete all child categories.",
      });
    }
  });

export type ISubCategory = z.infer<typeof SubCategory>;
export type IAddCategorySchema = z.infer<typeof AddCategorySchema>;
export type IAddCategorySchema_v2 = z.infer<typeof AddCategorySchema_v2>;
export type ICreateCategoryFormValidation = z.infer<
  typeof CreateCategoryFormValidation
>;

