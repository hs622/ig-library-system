import { calculateAge, cnicRegex, phoneRegex } from "@/lib/hepler";
import z from "zod";
import { DateOfBirthSchema } from "./date-of-birth.zod";


export const MemberFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    fatherName: z
      .string()
      .min(2, "Father's name must be at least 2 characters"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
    }),
    dob: DateOfBirthSchema,
    // z.coerce
    //   .date({ required_error: "Date of birth is required" })
    //   .max(new Date(), "Date of birth cannot be in the future"),

    formBNumber: z
      .string()
      .regex(/^\d{5}-\d{7}-\d{1}$/, {
        message: "Must be a valid B Form number: xxxxx-xxxxxxx-x.",
      })
      // strip hyphens if you want to store/send raw digits instead of the formatted string
      .transform((value) => value.replace(/-/g, "")),
    cnicNumber: z
      .string()
      .regex(/^\d{5}-\d{7}-\d{1}$/, {
        message: "Must be a valid CNIC number: xxxxx-xxxxxxx-x.",
      })
      // strip hyphens if you want to store/send raw digits instead of the formatted string
      .transform((value) => value.replace(/-/g, "")),

    address: z.string().min(5, "Address is required"),
    // jurisdiction: z.string().min(2, "Jurisdiction is required"),
    // province: z.string().min(2, "Province is required"),
    // city: z.string().min(2, "City is required"),
    contactNumber: z.string().regex(phoneRegex, "Enter a valid contact number"),
    email: z.string().email("Enter a valid email address"),

    // emergencyContactName: z.string().min(2, "Name is required"),
    // emergencyContactNumber: z
    //   .string()
    //   .regex(phoneRegex, "Enter a valid contact number"),

    highestEducation: z.string().min(2, "Highest education is required"),
    institution: z.string().min(2, "Institution is required"),
    progressDegree: z.string().min(2, "Progress/Degree is required"),
    educationStatus: z.enum(["completed", "anticipated"], {
      required_error: "Please select a status",
    }),
    yearOfCompletion: z.coerce
      .number({ invalid_type_error: "Enter a valid year" })
      .int()
      .min(1950, "Enter a valid year")
      .max(2100, "Enter a valid year"),

    profession: z.string().optional(),
    company: z.string().optional(),
    designation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const date = new Date(data.dob.year, data.dob.month, data.dob.day) // formating a date.
    const age = calculateAge(date);
    if (age === null) return;

    if (age < 18) {
      if (!data.formBNumber || data.formBNumber.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Form B Number is required for junior members",
          path: ["formBNumber"],
        });
      }
    } else {
      if (!data.cnicNumber || !cnicRegex.test(data.cnicNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Valid CNIC (12345-1234567-1) is required for senior members",
          path: ["cnicNumber"],
        });
      }
      if (!data.profession || data.profession.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Profession is required for senior members",
          path: ["profession"],
        });
      }
      if (!data.company || data.company.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company is required for senior members",
          path: ["company"],
        });
      }
      if (!data.designation || data.designation.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Designation is required for senior members",
          path: ["designation"],
        });
      }
    }
  });