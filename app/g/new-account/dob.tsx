"use client"

import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { IMemberFormSchema } from "@/types/zod"; 
import React from "react";
import { Control, Controller, FormState, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { QuestionLabel, underlineClass } from "./_common";
 

export default function AskDateOfBirthForm(
  { step, control, formState, setValue, register }:
    {
      step: { id: string, label: string, description?: string, section: string },
      control: Control<IMemberFormSchema>,
      formState: FormState<IMemberFormSchema>,
      watch: UseFormWatch<IMemberFormSchema>
      setValue: UseFormSetValue<IMemberFormSchema>
      register: UseFormRegister<IMemberFormSchema>
    }
) {
  const errors = formState.errors.dob;
  // const dobValue = watch("dob.year");
  return (
    <Field className="gap-4">
      <QuestionLabel step={step} />
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <Input
            id="year"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            {...register("dob.year")}
            className={cn(underlineClass(!!errors?.year), " text-center p-2 w-18 md:p-1 md:w-22")}
          />
          <span className="text-sm text-center text-foreground dark:text-foreground">Year</span>
        </div>

        <div className="flex flex-col gap-2">

          <Controller
            name="dob.month"
            control={control}
            render={({ field }) => (
            <Select onValueChange={(value) => setValue("dob.month", Number(value))} value={String(field.value)}>
              <SelectTrigger aria-placeholder="month" className={cn(underlineClass(!!errors?.month), "[&[data-placeholder]]:text-accent dark:bg-transparent dark:hover:bg-transparent cursor-pointer justify-center h-15! min-h-full w-16 md:w-20 [&>svg]:hidden")} {...register("dob.month")}>
                <SelectValue className="placeholder:text-accent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Jan</SelectItem>
                <SelectItem value="2">Feb</SelectItem>
                <SelectItem value="3">Mar</SelectItem>
                <SelectItem value="4">Apr</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">Jun</SelectItem>
                <SelectItem value="7">Jul</SelectItem>
                <SelectItem value="8">Aug</SelectItem>
                <SelectItem value="9">Sep</SelectItem>
                <SelectItem value="10">Oct</SelectItem>
                <SelectItem value="11">Nov</SelectItem>
                <SelectItem value="12">Dec</SelectItem>
              </SelectContent>
            </Select>
            )
            }
          />
          <span className="text-sm text-center text-foreground dark:text-foreground">Month</span>
        </div>

        <div className="flex flex-col gap-2">

          <Input
            id="day"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            {...register("dob.day")}
            className={cn(underlineClass(!!errors?.day), "text-center p-1 w-10 md:w-12")}
          />
          <span className="text-sm text-center text-foreground dark:text-foreground">Day</span>
        </div>
      </div>

      {step.id && <FieldDescription className="text-black dark:text-white">{step.description}</FieldDescription>}
      {(errors?.year && errors?.month && errors?.day) ? (
        <FieldError className="text-red-500">Enter your date of birth.</FieldError>
      ) : (
        <React.Fragment>
          {errors?.year && (<FieldError className="text-red-500">{errors.year.message}</FieldError>)}
          {errors?.month && (<FieldError className="text-red-500">{errors.month.message}</FieldError>)}
          {errors?.day && (<FieldError className="text-red-500">{errors.day.message}</FieldError>)}
        </React.Fragment>
      )}
    </Field>
  );
}