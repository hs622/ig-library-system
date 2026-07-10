"use client";

import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IMemberFormSchema } from "@/types/zod";
import { UseFormRegister } from "react-hook-form"; 
import { QuestionLabel, underlineClass } from "./_common";
import { InputGroup } from "@/components/ui/input-group";

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
      <InputGroup>
        
      </InputGroup>
      <Input
        id={step.id}
        type="number"
        autoFocus
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="+923001234567"
        className={underlineClass(!!error)}
        aria-invalid={!!error}
        {...register(step.id as "contactNumber")}
      />
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  );
}