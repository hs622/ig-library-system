import z from "zod";


export const DeleteConfirmationDialog = z.object({ confirmation: z.string() });