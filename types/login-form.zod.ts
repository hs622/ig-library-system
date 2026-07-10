import z from "zod";


export const LoginSchema = z.object({
  username: z.string().min(1, "please enter the username"),
  password: z.string().min(1, "please enter the password"),
});