"use client";

import React, { useMemo, useState } from "react";
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
import { stepAnimationStyles, StepField } from "./_common";
import getSteps from "./_questions";

const defaultValues: Partial<IMemberFormSchema> = {
  gender: undefined,
  educationStatus: undefined,
};

export default function NewMemberForm() {
  const form = useForm<IMemberFormSchema>({
    resolver: zodResolver(MemberFormSchema) as Resolver<IMemberFormSchema>,
    defaultValues,
    mode: "onTouched",
  });

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [submitted, setSubmitted] = useState<IMemberFormSchema | null>(null);

  const year = form.watch("dob.year");
  const month = form.watch("dob.month");
  const day = form.watch("dob.day");

  const age = useMemo(() => {
    const date = new Date(year, month, day)
    setDateOfBirth(date)
    return calculateAge(date)
  }, [year, month, day]);

  const steps = useMemo(() => getSteps(age), [age]);
  const currentIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[currentIndex];
  const isLastStep = currentIndex === steps.length - 1;

  async function goNext() {
    const valid = await form.trigger(currentStep.id);
    if (!valid) return;

    if (!isLastStep) {
      setDirection("forward");
      setStepIndex(currentIndex + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      setDirection("backward");
      setStepIndex(currentIndex - 1);
    }
  }

  function onSubmit(values: IMemberFormSchema) {
    setSubmitted(values);
    // TODO: replace with your server action, e.g. createLibraryMember(values)
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
        <div className="flex flex-1 flex-col items-start justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold">Registration submitted</h1>
          <p className="text-zinc-400">
            {submitted.fullName} has been registered as a{" "}
            {(calculateAge(dateOfBirth) ?? 0) < 18 ? "Junior" : "Senior"} member.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-zinc-700 bg-transparent text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50"
            onClick={() => {
              setSubmitted(null);
              setStepIndex(0);
              form.reset(defaultValues);
            }}
          >
            Register another member
          </Button>
        </div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-1 flex-col justify-center overflow-hidden">
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
                  onClick={goBack}
                  className="text-sm md:text-lg text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
                >
                  Back
                </button>
              )}
              <Button
                type="button"
                onClick={goNext}
                className="rounded-full h-16 w-16 dark:bg-white bg-black px-6 text-white dark:text-black hover:text-black hover:bg-accent"
              >
                {isLastStep ? <SendHorizontal size={"md"} /> : <MoveRight size={25} />}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* footer */}
      <div className="md:max-h-30 md:h-full overflow-hidden">
        {/* footer */}
      </div>

    </div>
  );
}












