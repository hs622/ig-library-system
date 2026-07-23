"use client";

import React, { useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, MoveRight, SendHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { FieldGroup } from "@/components/ui/field";
import { calculateAge } from "@/lib/hepler";
import { IMemberFormSchema } from "@/types/zod";
import { ModeSwitcher } from "@/components/buttons/theme-button-2";
import { MemberFormSchema } from "@/types/member-form.zod";
import { StepField } from "./_common";
import getSteps from "./_questions";
import { defaultMemberFormValues, useMemberFormStore } from "@/store/member-form-store";
import { createLibraryMember } from "@/app/actions/addNewMember";
import { Spinner } from "@/components/ui/spinner";
import { stepAnimationStyles } from "@/constants/new-account-form";

export default function NewMemberForm() {
  const {
    stepIndex,
    direction,
    submitted,
    dateOfBirth,
    formData,
    setDateOfBirth,
    setSubmitted,
    setFormData,
    goNext: storeGoNext,
    goBack: storeGoBack,
    skipToFirstStep,
    resetForm,
  } = useMemberFormStore();

  const form = useForm<IMemberFormSchema>({
    resolver: zodResolver(MemberFormSchema) as Resolver<IMemberFormSchema>,
    // seed from whatever's already in the store (survives remounts within the session)
    defaultValues: formData,
    mode: "onTouched",
  });

  // mirror every field change into the store as the single source of truth
  React.useEffect(() => {
    const subscription = form.watch((values) => {
      setFormData(values as Partial<IMemberFormSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  const year = form.watch("dob.year");
  const month = form.watch("dob.month");
  const day = form.watch("dob.day");

  const age = useMemo(() => {
    const date = new Date(year, month - 1, day);
    setDateOfBirth(date);
    return calculateAge(date);
  }, [year, month, day, setDateOfBirth]);

  const steps = useMemo(() => getSteps(age), [age]);
  const currentIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[currentIndex];
  const isLastStep = currentIndex === steps.length - 1;

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  async function goNext() {
    const valid = await form.trigger(currentStep.id);
    if (!valid) return;

    if (!isLastStep) {
      storeGoNext(steps.length - 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      storeGoBack();
    }
  }

  // Skip option: available from any step, jumps straight back to step 1
  function handleSkip() {
    skipToFirstStep();
  }

  async function onSubmit(values: IMemberFormSchema) {
    setSubmitError(null);
    console.log(values)
    const result = await createLibraryMember(values);

    if (result.success) {
      setSubmitted(values);
    } else {
      setSubmitError(result.error);
      console.error("createLibraryMember failed:", result.error, "fieldErrors" in result ? result.fieldErrors : undefined);
    }
  }

  return (
    <div className="flex flex-col rounded-3xl border px-8 py-6 text-zinc-50 w-full h-full sm:h-full sm:px-16">
      {/* Header */}
      <div className="md:max-h-30 md:h-full overflow-hidden flex items-start md:items-end justify-between">
        <span className="text-sm font-medium text-zinc-300"></span>
        {!submitted && (
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-foreground dark:text-foreground">
              Step {currentIndex + 1} - {steps.length}
            </span>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-accent">
              <div
                className="h-full rounded-full dark:bg-white bg-black transition-all"
                style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <ModeSwitcher />
          </div>
        )}
      </div>

      {submitted ? (
        <div className="sm:ml-40 w-[70%] flex flex-1 flex-col items-start justify-center gap-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex flex-col gap-4 text-3xl md:text-5xl text-black dark:text-white ">
            <span>Thank you for registering with</span>
            <span className="font-bold">INAARA GARDEN LIBRARY</span>
            <span>
              Kindly pay the registration fee at the library to confirm your membership.
            </span>
          </div>
          <Button
            variant="outline"
            className="mt-4 border-black bg-transparent text-black dark:text-white hover:bg-zinc-800 hover:text-zinc-50"
            onClick={() => {
              resetForm();
              form.reset(defaultMemberFormValues);
            }}
          >
            Register another member
          </Button>
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-1 flex-col justify-center overflow-hidden" noValidate>
          <style>{stepAnimationStyles}</style>
          <div
            key={currentStep.id}
            className={cn("w-full max-w-xl sm:ml-40", direction === "forward" ? "step-forward" : "step-backward")}
          >
            <FieldGroup>
              <StepField step={currentStep} form={form} />
            </FieldGroup>

            <div className="mt-10 flex items-center justify-end gap-4">
              {currentIndex > 0 && (
                <button
                  type="button"
                  disabled={form.formState.isSubmitting}
                  onClick={goBack}
                  className="text-sm md:text-lg text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
                >
                  Back
                </button>
              )}
              <Button
                type="button"
                disabled={form.formState.isSubmitting}
                onClick={goNext}
                className="rounded-full h-16 w-16 dark:bg-white bg-black px-6 text-white dark:text-black hover:text-black hover:bg-accent"
              >
                {!isLastStep
                  ? <MoveRight className="size-6" />
                  : form.formState.isSubmitting
                    ? <Spinner className={cn("size-6")} />
                    : <SendHorizontal className="size-6" />
                }
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* footer */}
      <div className="md:max-h-30 md:h-full overflow-hidden">
        {currentIndex > 0 && currentIndex == steps.length && (
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm md:text-lg text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}