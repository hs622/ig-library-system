"use client"

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { IMemberFormSchema } from "@/types/zod";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { QuestionLabel, underlineClass } from "./_common";

export default function AskEmailForm(
  { error, step, register }: {
    error: string | undefined, step: { id: string, label: string, description?: string, section: string },
    register: UseFormRegister<IMemberFormSchema>
  }
) {
  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <Input id={step.id} type="email" autoFocus className={underlineClass(!!error)} aria-invalid={!!error} {...register(step.id as "email")} />
      {step.description && <FieldDescription className="text-black dark:text-white">{step.description}</FieldDescription>}
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  );
}