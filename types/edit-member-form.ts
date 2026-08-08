import z from "zod"
import { MemberFormSchema } from "./member-form.zod"

export const EditMemberFormSchema = MemberFormSchema.pick({
  fullName: true,
  fatherName: true,
  email: true,
  address: true,
  cnicNumber: true,
  contactNumber: true,
  suggestionForImprovement: true
}).extend({
  libraryId: z.string()
})

export type IEditMemberFormSchema = z.infer<typeof EditMemberFormSchema>