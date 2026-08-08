import { calculateAge } from "@/lib/hepler";
import z from "zod";
import { DateOfBirthSchema } from "./date-of-birth.zod";
import { InterestOfOptions } from "@/constants/new-account-form";

// export type AreaOfInterest = (typeof InterestOfOptions)[number];
const allowedInterests = InterestOfOptions.map((v) =>
  v.toLowerCase().replaceAll(" ", "-"),
);

export const MemberFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
  dob: DateOfBirthSchema,
  cnicNumber: z
    .string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, {
      message: "Must be in the format: xxxxx-xxxxxxx-x.",
    })
    // strip hyphens if you want to store/send raw digits instead of the formatted string
    .transform((value) => value.replace(/-/g, "")),

  address: z.string().min(5, "Address is required"),
  contactNumber: z
    .string()
    .regex(/^\d{3}-\d{7}$/, {
      message: "Must be in the format: xxx-xxxxxxx.",
    })
    .transform((value) => value.replace(/-/g, "")),

  email: z.string().email("Enter a valid email address").optional(),
  highestEducation: z.string().min(2, "Highest education is required"),
  institution: z.string().min(2, "Institution is required"),

  areaOfInterest: z
    .array(z.string(), {
      message: "Select at least one of them.",
    })
    .min(1, "Select at least one area of interest")
    .refine((vals) => vals.every((v) => allowedInterests.includes(v)), {
      message: "Invalid area of interest selected",
    }),

  partOfReadingClub: z.boolean({ message: "Select anyone." }),
  genre: z.string().min(1, "Enter at least one genre."),
  activities: z.string().optional(),
  suggestionForImprovement: z
    .string()
    .max(200, { message: "200 characters limit." })
    .optional(),
});

export const MemberFromSchemaWithRefine = MemberFormSchema.superRefine(
  (data, ctx) => {
    console.log("working...");
    const date = new Date(data.dob.year, data.dob.month - 1, data.dob.day); // formating a date.
    const age = calculateAge(date);
    if (age === null) return;
  },
);

export type IMemberFormSchema = z.infer<typeof MemberFormSchema>;
