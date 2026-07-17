import z from "zod";
import { MemberFormSchema } from "./member-form.zod";

export const MemberSchema = MemberFormSchema.extend({
  _id: z.string(),
  role: z.string(),
  libraryId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})