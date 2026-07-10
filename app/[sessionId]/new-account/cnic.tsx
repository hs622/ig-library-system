"use client"

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IMemberFormSchema } from "@/types/zod";
import { UseFormRegister, UseFormSetValue } from "react-hook-form"; 
import { formatCNICNumber } from "@/lib/hepler";
import { QuestionLabel, underlineClass } from "./_common";

export default function AskCINCForm(
  { error, step, register, setValue }:
    {
      error: string | undefined,
      step: { id: string, label: string, description?: string, section: string },
      register: UseFormRegister<IMemberFormSchema>,
      setValue: UseFormSetValue<IMemberFormSchema>
    }
) {
  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <Input
        id={step.id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoFocus
        maxLength={15}
        placeholder="12345-1234567-1"
        className={underlineClass(!!error)}
        aria-invalid={!!error}
        {...register(step.id as "cnicNumber", {
          onChange(event) {
            const formatted = formatCNICNumber(event.target.value);
            setValue("cnicNumber", formatted, { shouldValidate: true });
          },
        })}
      />
      {step.description && <FieldDescription className="text-zinc-400">{step.description}</FieldDescription>}
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  )
}