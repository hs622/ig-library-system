import z from "zod";

const currentYear = new Date().getFullYear();

export const DateOfBirthSchema = z
  .object({
    year: z.coerce
      .number({ invalid_type_error: "Year is required" })
      .int("Year must be a whole number")
      .min(1900, "Your birth year is mamdatory.")
      .max(currentYear, `Year cannot be later than ${currentYear}`),
    month: z.coerce
      .number({ invalid_type_error: "Month is required" })
      .int()
      .min(1, "Select your brith month.")
      .max(12, "Invalid month"),
    day: z.coerce
      .number({ invalid_type_error: "Day is required" })
      .int()
      .min(1, "Enter your brith day.")
      .max(31, "Invalid day"),
  })
  .superRefine((data, ctx) => {
    const { year, month, day } = data;

    // Days-in-month check (handles leap years correctly)
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${monthName(month)} ${year} only has ${daysInMonth} days`,
        path: ["day"],
      });
    }

    // Optional: reject future dates
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    if (inputDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date cannot be in the future",
        path: ["day"],
      });
    }
  });

function monthName(month: number) {
  return new Date(2000, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
}
