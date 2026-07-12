"use client";

import { Field, FieldError } from "@/components/ui/field";
import { IMemberFormSchema } from "@/types/zod";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { QuestionLabel, underlineClass } from "./_common";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { formatContactNumber } from "@/lib/hepler";

export default function AskContactForm(
  { error, step, register, setValue }: {
    error: string | undefined,
    step: { id: string, label: string, description?: string, section: string },
    register: UseFormRegister<IMemberFormSchema>
    setValue: UseFormSetValue<IMemberFormSchema>
  }
) {

  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <InputGroup
        className={cn(
          underlineClass(!!error),
          "border-none ring-0 outline-none shadow-none",
          "focus:border-none focus:ring-0 focus:outline-none focus:shadow-none",
          "focus-within:border-none focus-within:ring-0 focus-within:outline-none focus-within:ring-offset-0 focus-within:shadow-none",
          "focus-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:shadow-none",
          "active:border-none active:ring-0 active:outline-none active:shadow-none",
          "hover:border-none hover:ring-0 hover:outline-none hover:shadow-none",
          "aria-invalid:border-none aria-invalid:ring-0 aria-invalid:outline-none aria-invalid:ring-offset-0 aria-invalid:shadow-none",
          "data-[invalid=true]:border-none data-[invalid=true]:ring-0 data-[invalid=true]:outline-none data-[invalid=true]:shadow-none"
        )}
      >
        <InputGroupAddon className="text-2xl sm:text-3xl">+92</InputGroupAddon>
        <InputGroupInput
          id={step.id}
          type="text"
          autoFocus
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={11}
          className={cn(
            "text-2xl md:text-3xl",
            "border-none ring-0 outline-none shadow-none",
            "focus:border-none focus:ring-0 focus:outline-none focus:shadow-none",
            "focus-within:border-none focus-within:ring-0 focus-within:outline-none focus-within:ring-offset-0 focus-within:shadow-none",
            "focus-visible:border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:shadow-none",
            "active:border-none active:ring-0 active:outline-none active:shadow-none",
            "hover:border-none hover:ring-0 hover:outline-none hover:shadow-none",
            "aria-invalid:border-none aria-invalid:ring-0 aria-invalid:outline-none aria-invalid:ring-offset-0 aria-invalid:shadow-none",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          aria-invalid={!!error}
          {...register(step.id as "contactNumber", {
            onChange(event) {
              const formatted = formatContactNumber(event.target.value);
              setValue("contactNumber", formatted, { shouldValidate: true });
            },
          })}
        />

      </InputGroup>
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  );
}