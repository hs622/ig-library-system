import { Field, FieldDescription, FieldError } from "@/components/ui/field"
import { IMemberFormSchema } from "@/types/zod"
import { UseFormRegister } from "react-hook-form"
import { QuestionLabel, underlineClass } from "./_common"
import { Input } from "@/components/ui/input"

export default function Genre({
  step,
  error,
  register,
}: {
  step: { id: string, label: string, description?: string, section: string },
  error: string | undefined,
  register: UseFormRegister<IMemberFormSchema>
}) {

  return (
    <Field>
      <QuestionLabel step={step} />
      <Input
        type="text"
        autoFocus
        className={underlineClass(!!error)}
        { ...register("genre") }
      />

      {step.id && <FieldDescription className="text-black dark:text-white">{step.description}</FieldDescription>}
      {error && <FieldError className="text-red-500">{error}</FieldError>}
    </Field>
  )
}