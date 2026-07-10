"use client"

import { Field, FieldError } from "@/components/ui/field" 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { IMemberFormSchema } from "@/types/zod"
import { UseFormSetValue, WatchDefaultValue } from "react-hook-form"
import { cn } from "@/lib/utils"
import { QuestionLabel } from "./_common"


export default function AskGenderForm(
  { error, step, setValue, watch }:
    { error: string | undefined, step: { id: string, label: string }, setValue: UseFormSetValue<IMemberFormSchema>, watch: WatchDefaultValue<"gender"> }
) {

  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <RadioGroup
        value={watch("gender")}
        onValueChange={(v) => setValue("gender", v as IMemberFormSchema["gender"], { shouldValidate: true })}
        className="flex gap-3"
      >
        {(["male", "female"] as const).map((g) => (
          <label
            key={g}
            htmlFor={`gender-${g}`}
            className={cn(
              "cursor-pointer rounded-full w-35 h-35 flex justify-center items-center border px-5 py-2.5 text-2xl md:text-3xl capitalize transition-colors",
              watch("gender") === g
                ? "border-white bg-white text-black dark:border-white"
                : "border-black text-black hover:bg-black hover:text-white"
            )}
          >
            <RadioGroupItem value={g} id={`gender-${g}`} className="sr-only hidden" />
            {g}
          </label>
        ))}
      </RadioGroup>
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  )
}