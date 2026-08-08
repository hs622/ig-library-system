import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { QuestionLabel, underlineClass } from "./_common";
import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { IMemberFormSchema } from "@/types/member-form.zod";

export default function TextInput(
  {
    error,
    step,
    register
  }: {
    error: string | undefined,
    step: { id: string, description?: string, label: string },
    register: UseFormRegister<IMemberFormSchema>
  }
) {

  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <Input id={step.id} autoFocus className={underlineClass(!!error)} aria-invalid={!!error} {
        ...register(step.id as "fullName" | "fatherName" | "address" | "institution" | "highestEducation")
      } />
      {step.description && <FieldDescription className="text-zinc-400">{step.description}</FieldDescription>}
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  )
}