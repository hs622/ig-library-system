import { Field, FieldDescription, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";
import { QuestionLabel, underlineClass } from "./_common";
import { Control, Controller, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { IMemberFormSchema } from "@/types/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";



export default function PartOfReadingClub({
    step,
    error,
    control,
    setValue
  }: {
    step: { id: string, label: string, description?: string, section: string },
    error: string | undefined,
    control: Control<IMemberFormSchema>,
    setValue: UseFormSetValue<IMemberFormSchema>
  },
) {

  return (
    <Controller
      name="partOfReadingClub"
      control={control}
      render={({ field }) => (
        <Field>
          <QuestionLabel step={step} />
          <RadioGroup
            name={field.name}
            value={field.value ? "yes" : "no"}
            onValueChange={(value) => setValue("partOfReadingClub", value == "yes" ? true : false)}
          >
            <FieldLabel htmlFor="form-reading-club-yes" className="cursor-pointer border-none">
              <Field orientation="horizontal" >
                <FieldTitle className="text-black dark:text-white text-lg">Yes! I would love too 😍</FieldTitle>
                <RadioGroupItem value="yes" id="form-reading-club-yes" className="sr-only hidden"/>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="form-reading-club-no" className="cursor-pointer border-none">
              <Field orientation="horizontal">
                <FieldTitle className="text-black dark:text-white text-lg">Nah! Another time 😏</FieldTitle>
                <RadioGroupItem value="no" id="form-reading-club-no" className="sr-only hidden"/>
              </Field>
            </FieldLabel>
          </RadioGroup>

          {step.description && <FieldDescription className="text-black dark:text-white">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-500">{error}</FieldError>}
        </Field>
      )}
    />
  )
}