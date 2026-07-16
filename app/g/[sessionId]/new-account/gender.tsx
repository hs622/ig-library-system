"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { IMemberFormSchema } from "@/types/zod"
import { Control, Controller, UseFormSetValue } from "react-hook-form"
import { cn } from "@/lib/utils"
import { QuestionLabel } from "./_common"
import { Check } from "lucide-react"


export default function AskGenderForm(
  { error, step, setValue, control }:
    {
      error: string | undefined,
      step: { id: string, description?: string, label: string, section: string },
      setValue: UseFormSetValue<IMemberFormSchema>, control: Control<IMemberFormSchema>
    }
) {

  return (
    <Controller
      name="gender"
      control={control}
      render={({ field }) => (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={(v) => setValue("gender", v as IMemberFormSchema["gender"], { shouldValidate: true })}
            className="grid grid-cols-2 gap-2"
          >
            {(["male", "female"] as const).map((g) => (
              <FieldLabel
                key={g}
                htmlFor={`gender-${g}`}
                className={cn(
                  "cursor-pointer flex justify-center items-center px-5 py-2.5 text-9xl bg-transparent",
                  "has-data-checked:bg-transparent!"
                )}
              >
                <RadioGroupItem
                  value={g} id={`gender-${g}`} className="sr-only hidden" 
                />
                {g === "male" ? "👦🏼" : "👩🏻"}

                <Check className={`${cn("text-black dark:text-white", field.value == g ? "opacity-100" : "opacity-0")}`} />
              </FieldLabel>
            ))}
          </RadioGroup>
          {step.description && <FieldDescription className="text-black dark:text-white">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      )}
    />
  )
}