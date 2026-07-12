"use client";

import { Field, FieldError } from "@/components/ui/field";
import { IMemberFormSchema } from "@/types/zod";
import { UseFormRegister } from "react-hook-form";
import { QuestionLabel, underlineClass } from "./_common";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export default function AskContactForm(
  { error, step, register }: {
    error: string | undefined,
    step: { id: string, label: string, description?: string, section: string },
    register: UseFormRegister<IMemberFormSchema>
  }
) {

  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <InputGroup className={cn(underlineClass(!!error), "focus:ring-0 focus-visible:border-none")} >
        <InputGroupAddon className="text-2xl sm:text-3xl">+92</InputGroupAddon>
        <InputGroupInput
          id={step.id}
          type="number"
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          className={cn(
            "text-2xl md:text-3xl",
            "border-none ring-0 outline-none",
            "focus:border-none focus:ring-0 focus:outline-none",
            "focus-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-within:ring-offset-0",
            "aria-invalid:ring-0 aria-invalid:ring-offset-0 aria-invalid:shadow-none",

            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none")}
          aria-invalid={!!error}
          {...register(step.id as "contactNumber")}
        />
      </InputGroup>
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  );
}