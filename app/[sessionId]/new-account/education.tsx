"use client"

import { Field, FieldError } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { IMemberFormSchema } from "@/types/zod" 
import { UseFormSetValue, WatchDefaultValue } from "react-hook-form"
import { QuestionLabel } from "./_common"

export default function AskEducationForm(
  { error, step, setValue, watch }:
    { error: string | undefined, step: { id: string, label: string }, setValue: UseFormSetValue<IMemberFormSchema>, watch: WatchDefaultValue<"educationStatus"> }
) {

  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <RadioGroup
        value={watch("educationStatus")}
        onValueChange={(v) =>
          setValue("educationStatus", v as IMemberFormSchema["educationStatus"], { shouldValidate: true })
        }
        className="flex gap-3"
      >
        {(["completed", "anticipated"] as const).map((s) => (
          <label
            key={s}
            htmlFor={`status-${s}`}
            className={cn(
              "cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium capitalize transition-colors",
              watch("educationStatus") === s
                ? "border-zinc-50 bg-zinc-50 text-zinc-900"
                : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            )}
          >
            <RadioGroupItem value={s} id={`status-${s}`} className="sr-only" />
            {s}
          </label>
        ))}
      </RadioGroup>
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  )
}
