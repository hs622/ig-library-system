import { UseFormRegister } from "react-hook-form";
import { QuestionLabel, underlineClass } from "./_common";
import { IMemberFormSchema } from "@/types/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";



export default function Activities(
  {
    step,
    error,
    register
  }: {
    step: { id: string, label: string, description?: string, section: string },
    error: string | undefined,
    register: UseFormRegister<IMemberFormSchema>
  }
) {

  return (
    <Field>
      <QuestionLabel step={step} />
      <Input 
        id="form-new-account-activities"
        type="text"
        className={underlineClass(!!error)}
        { ...register("activities") }
      />

      {step.description && <FieldDescription className={"text-foreground"}>{step.description}</FieldDescription>}
      {error && <FieldError className={"text-red-500"}>{error}</FieldError>}
    </Field>
  )
}