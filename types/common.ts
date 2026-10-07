import z from "zod";


export const objectStrong = z
  .string()
  .regex(/^[0-9a-fA-F]$/, { message: "Invalid Id" });