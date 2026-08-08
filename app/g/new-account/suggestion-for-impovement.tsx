import { Field, FieldDescription, FieldError } from "@/components/ui/field"

import { Control, Controller } from "react-hook-form"
import { QuestionLabel, underlineClass } from "./_common"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { IMemberFormSchema } from "@/types/member-form.zod"


export default function SuggestionForImprovement({
  step,
  error,
  control
}: {
  step: { id: string, label: string, description?: string, section: string },
  error: string | undefined,
  control: Control<IMemberFormSchema>
}) {
  return (
    <Controller
      name="suggestionForImprovement"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <QuestionLabel step={step} />
          <Textarea
            id={`${"form-new-account-suggestion"}`}
            value={field.value}
            autoFocus
            onChange={field.onChange}
            aria-invalid={fieldState.invalid}
            className={`${cn(underlineClass(!!error), "resize-none h-45")}`}
          />

          {step.description && <FieldDescription className="text-black dark:text-white">{step.description}</FieldDescription>}
          {error && <FieldError className={"text-red-500"}>{error}</FieldError>}
        </Field>
      )}
    />
  )
}