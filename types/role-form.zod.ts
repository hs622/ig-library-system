import { z } from "zod";

export const RoleFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(250, "Title cannot exceed 250 characters."),
  slug: z.string().trim().min(1, "Slug is required."),
  description: z.string().trim().max(300, "Description cannot exceed 300 characters.").optional(),
  level: z.number().int().positive("Level must be a positive integer."),
  status: z.boolean().default(false),
  permissionIds: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Select a valid permission."))
    .min(1, "Select at least one permission."),
});

export type RoleFormValues = z.infer<typeof RoleFormSchema>;
