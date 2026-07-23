import { IMemberFormSchema } from "@/types/zod"
import { Control, Controller } from "react-hook-form"
import { QuestionLabel } from "./_common"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Check } from "lucide-react"
import { InterestOfOptions } from "@/constants/new-account-form"

export default function AreaOfInterest({
  error,
  step,
  control
}: {
  error: string | undefined,
  step: { id: string, label: string, description?: string, section: string },
  control: Control<IMemberFormSchema>
}) {

  return (
    <Controller
      name="areaOfInterest"
      control={control}
      render={({ field }) => (
        <Field
          data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <ScrollArea className="h-42">
            <div className="flex flex-col gap-2">
              {InterestOfOptions.map((opt, i) => (
                <FieldLabel key={i}>
                  <Field orientation={"horizontal"}>
                    <FieldContent>
                      <Field className="text-black dark:text-white capitalize" >{opt}</Field>
                    </FieldContent>
                    <Checkbox
                      id={`form-new-account-area-of-interest-${opt.toLocaleLowerCase().replaceAll(" ", "-")}`}
                      checked={field.value?.includes(opt.toLocaleLowerCase().replaceAll(" ", "-"))}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field?.value ?? [], opt.toLocaleLowerCase().replaceAll(" ", "-")]
                          : field.value.filter((value) => value !== opt.toLocaleLowerCase().replaceAll(" ", "-"))

                        field.onChange(newValue)
                      }}
                      name={opt.toLocaleLowerCase().replaceAll(" ", "-")}
                      className="hidden"
                    />
                    <Check className={`text-black dark:text-white ${field.value?.includes(opt.toLocaleLowerCase().replaceAll(" ", "-")) ? "opacity-100" : "opacity-0"}`} />
                  </Field>
                </FieldLabel>
              ))}
            </div>
          </ScrollArea>
          {step.description && <FieldDescription className="text-black dark:text-white">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      )}
    />
  )
}