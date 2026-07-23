import { Field, FieldDescription, FieldError } from "@/components/ui/field"
import { IMemberFormSchema } from "@/types/zod"
import { Control, Controller } from "react-hook-form"
import { QuestionLabel, underlineClass } from "./_common"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"


export default function SuggestionForImpovement({
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
      name="suggestionForImpovement"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <QuestionLabel step={step} />
          <Textarea
            id={`${"form-new-account-suggestion"}`}
            value={field.value}
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