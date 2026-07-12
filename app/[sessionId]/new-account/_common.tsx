"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import AskDateOfBirthForm from "./dob";
import AskEducationForm from "./education";
import AskGenderForm from "./gender";
import AskYearOfCompletionForm from "./year-of-completion";
import AskEmailForm from "./email";
import AskContactForm from "./contact";
import AskCINCForm from "./cnic";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { IMemberFormSchema } from "@/types/zod";
import AskBFormNumberForm from "./b-form";

type SectionKey = "personal" | "emergency" | "education" | "professional";

export type StepDef = {
  id: keyof IMemberFormSchema;
  section: SectionKey;
  label: string;
  description?: string;
};

// export const PROVINCES = [
//   "Punjab",
//   "Sindh",
//   "Khyber Pakhtunkhwa",
//   "Balochistan",
//   "Gilgit-Baltistan",
//   "Azad Jammu & Kashmir",
//   "Islamabad Capital Territory",
// ];

export const QuestionLabel = ({ step }: { step: { id: string, label: string } }) => (
  <FieldLabel htmlFor={step.id} className="text-4xl sm:text-6xl font-bold leading-snug dark:text-foreground text-foreground">
    {step.label}
  </FieldLabel>
);


export function underlineClass(hasError?: boolean) {
  return cn(
    "h-15 rounded-none shadow-none dark:bg-accect p-0 text-2xl md:text-3xl sm:py-2 text-black dark:text-white",
    "placeholder:text-accent border-0 border-b border-black dark:border-white",
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
    // neutralize shadcn's default invalid ring/box so only the bottom line changes color
    "outline-hidden ring-0 ring-offset-0",
    "focus:outline-hidden focus:ring-0",
    "focus-visible:outline-hidden focus-visible:ring-0",
    "aria-invalid:ring-0 aria-invalid:ring-offset-0 aria-invalid:shadow-none",
    hasError
      ? "border-red-500 focus-visible:border-red-500 aria-invalid:border-red-500"
      : "focus:border-0 focus:border-b focus:border-black dark:focus:border-white" + "focus-visible:border-b focus-visible:border-white dark:focus-visible:border-white focus-visible:border-black"
  );
}

export const stepAnimationStyles = `
@keyframes stepSlideInForward {
  from { opacity: 0; transform: translateX(28px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes stepSlideInBackward {
  from { opacity: 0; transform: translateX(-28px); }
  to { opacity: 1; transform: translateX(0); }
}
.step-forward { animation: stepSlideInForward 320ms cubic-bezier(0.16, 1, 0.3, 1); }
.step-backward { animation: stepSlideInBackward 320ms cubic-bezier(0.16, 1, 0.3, 1); }
`;

export function StepField({
  step,
  form,
}: {
  step: StepDef;
  form: ReturnType<typeof useForm<IMemberFormSchema>>;
}) {
  const { register, setValue, watch, formState, control } = form;
  const error = formState.errors[step.id]?.message as string | undefined;

  switch (step.id) {
    // case "jurisdiction":
    // case "city":
    // case "emergencyContactName":
    case "fullName":
    case "fatherName":
    case "address":
    case "institution":
    case "progressDegree":
    // case "profession":
    // case "company":
    // case "designation":
    case "highestEducation":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Input id={step.id} className={underlineClass(!!error)} aria-invalid={!!error} {...register(step.id)} />
          {step.description && <FieldDescription className="text-zinc-400">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    // case "formBNumber":
    //   return <AskBFormNumberForm error={error} register={register} step={step} setValue={setValue} />;

    case "cnicNumber":
      return <AskCINCForm error={error} register={register} step={step} setValue={setValue} />;

    // case "emergencyContactNumber":
    case "contactNumber":
      return <AskContactForm step={step} error={error} register={register} />

    case "email":
      return <AskEmailForm step={step} error={error} register={register} />

    case "yearOfCompletion":
      return <AskYearOfCompletionForm error={error} register={register} step={step} />

    case "gender":
      return <AskGenderForm error={error} setValue={setValue} step={step} watch={watch} />;

    case "educationStatus":
      return <AskEducationForm error={error} setValue={setValue} step={step} watch={watch} />;

    case "dob":
      return <AskDateOfBirthForm step={step} control={control} register={register} formState={formState} setValue={setValue} watch={watch} />

    default:
      return null;

    // case "province":
    //   return (
    //     <Field data-invalid={!!error} className="gap-4">
    //       <QuestionLabel step={step} />
    //       <Select value={watch("province")} onValueChange={(v) => setValue("province", v, { shouldValidate: true })}>
    //         <SelectTrigger className={cn(underlineClass(!!error), "w-full")}>
    //           <SelectValue placeholder="Select province" />
    //         </SelectTrigger>
    //         <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-50">
    //           {PROVINCES.map((p) => (
    //             <SelectItem key={p} value={p} className="focus:bg-zinc-800 focus:text-zinc-50">
    //               {p}
    //             </SelectItem>
    //           ))}
    //         </SelectContent>
    //       </Select>
    //       {error && <FieldError className="text-red-400">{error}</FieldError>}
    //     </Field>
    //   );
  }
}
