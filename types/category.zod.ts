import z from "zod";

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