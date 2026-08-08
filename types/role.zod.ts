import z from "zod";

export const Role = z.enum(["admin", "member", "idle"]);

export type TRole = z.infer<typeof Role>;







