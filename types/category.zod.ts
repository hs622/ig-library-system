import z from "zod";
import { objectStrong } from "./common";

export const CategorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "category is required." })
    .max(150, { message: "Max 150 characters long" }),
  code: z.string(),
  parentId: objectStrong.optional(),
  isAssociated: z.boolean(),
  isParent: z.boolean(),
  visiable: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ICategorySchema = z.infer<typeof CategorySchema>;

