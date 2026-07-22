import z from "zod";


export const DepositSchema = z.object({
  userId: z.string(),
  reason: z.string({ message: "What type of amount it is?" }),
  amount: z.number({ message: "Amount should be great than 0.00."})
})