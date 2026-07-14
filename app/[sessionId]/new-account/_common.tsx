"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import AskDateOfBirthForm from "./dob";
import AskGenderForm from "./gender";
import AskEmailForm from "./email";
import AskContactForm from "./contact";
import AskCINCForm from "./cnic";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { IMemberFormSchema } from "@/types/zod";
import AreaOfInterest from "./area-of-Interest";
import PartOfReadingClub from "./part-of-our-reading-club";
import Genre from "./genre";
import Activities from "./activities";
import SuggestionForImpovement from "./suggestion-for-impovement";

// import AskEducationForm from "./education";
// import AskYearOfCompletionForm from "./year-of-completion";
// import AskBFormNumberForm from "./b-form";

type SectionKey = "personal" | "education" | "opinion" | "interest";

export type StepDef = {
  id: keyof IMemberFormSchema;
  section: SectionKey;
  label: string;
  description?: string;
};

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
    "outline-hidden ring-0 ring-offset-0",
    "focus:outline-hidden focus:ring-0",
    "focus-visible:outline-hidden focus-visible:ring-0",
    "aria-invalid:ring-0 aria-invalid:ring-offset-0 aria-invalid:shadow-none",
    hasError
      ? "border-red-500 focus-visible:border-red-500 aria-invalid:border-red-500"
      : "focus:border-0 focus:border-b focus:border-black dark:focus:border-white" + "focus-visible:border-b focus-visible:border-white dark:focus-visible:border-white focus-visible:border-black"
  );
}

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
    case "fullName":
    case "fatherName":
    case "address":
    case "institution":
    case "highestEducation":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Input id={step.id} className={underlineClass(!!error)} aria-invalid={!!error} {...register(step.id)} />
          {step.description && <FieldDescription className="text-zinc-400">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    case "areaOfInterest":
      return <AreaOfInterest error={error} step={step} control={control} />

    case "cnicNumber":
      return <AskCINCForm error={error} register={register} step={step} setValue={setValue} />;

    case "contactNumber":
      return <AskContactForm step={step} error={error} register={register} setValue={setValue} />

    case "email":
      return <AskEmailForm step={step} error={error} register={register} />

    case "partOfReadingClub":
      return <PartOfReadingClub error={error} step={step} control={control} setValue={setValue}/>

    case "genre":
      return <Genre step={step} register={register} error={error} />

    case "gender":
      return <AskGenderForm error={error} setValue={setValue} step={step} control={control} />;

    case "dob":
      return <AskDateOfBirthForm step={step} control={control} register={register} formState={formState} setValue={setValue} watch={watch} />

    case "activities":
      return <Activities step={step} error={error} register={register} />

    case "suggestionForImpovement":
      return <SuggestionForImpovement step={step} error={error} control={control} />

    default:
      return null;
  }
}
