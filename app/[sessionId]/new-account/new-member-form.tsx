"use client";

import { useMemo, useState } from "react";
import { useForm, UseFormSetValue, WatchDefaultValue, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, MoveRight, SendHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { calculateAge } from "@/lib/hepler";
import { IMemberFormSchema, MemberFormSchema } from "@/types/zod";
import { ModeToggle2 } from "@/components/buttons/theme-button-2";

// ---------------------------------------------------------------------------
// Step configuration — one field per "question"
// ---------------------------------------------------------------------------

type SectionKey = "personal" | "emergency" | "education" | "professional";

type StepDef = {
  id: keyof IMemberFormSchema;
  section: SectionKey;
  label: string;
  description?: string;
};

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
  "Islamabad Capital Territory",
];

function getSteps(age: number | null): StepDef[] {
  const isJunior = age !== null && age < 18;

  const steps: StepDef[] = [
    { id: "fullName", section: "personal", label: "What's your full name?" },
    { id: "fatherName", section: "personal", label: "What's your father's name?" },
    { id: "gender", section: "personal", label: "What's your gender?" },
    {
      id: "dob",
      section: "personal",
      label: "What is your age?",
      description: "Under 18 registers as a Junior Member, 18 and above as a Senior Member.",
    },
  ];

  if (age !== null) {
    steps.push(
      isJunior
        ? { id: "formBNumber", section: "personal", label: "What is the Form B Number?" }
        : {
          id: "cnicNumber",
          section: "personal",
          label: "What is the CNIC Number?",
          description: "Format: 12345-1234567-1",
        }
    );
  }

  steps.push(
    { id: "address", section: "personal", label: "What is the residential address?" },
    { id: "jurisdiction", section: "personal", label: "Which jurisdiction does this fall under?" },
    { id: "province", section: "personal", label: "Which province is this in?" },
    { id: "city", section: "personal", label: "Which city is this in?" },
    { id: "contactNumber", section: "personal", label: "What is the contact number?" },
    { id: "email", section: "personal", label: "What is the email address?" },

    { id: "emergencyContactName", section: "emergency", label: "Who should we contact in an emergency?" },
    { id: "emergencyContactNumber", section: "emergency", label: "What is their contact number?" },

    { id: "highestEducation", section: "education", label: "What is the highest level of education?" },
    { id: "institution", section: "education", label: "Which institution was / is attended?" },
    { id: "progressDegree", section: "education", label: "What is the progress / degree?" },
    { id: "educationStatus", section: "education", label: "Is this completed or anticipated?" },
    { id: "yearOfCompletion", section: "education", label: "What year was / will this be completed?" }
  );

  if (!isJunior && age !== null) {
    steps.push(
      { id: "profession", section: "professional", label: "What is the profession?" },
      { id: "company", section: "professional", label: "Which company is this for?" },
      { id: "designation", section: "professional", label: "What is the designation?" }
    );
  }

  return steps;
}

const defaultValues: Partial<IMemberFormSchema> = {
  gender: undefined,
  educationStatus: undefined,
};

// Slide + fade animation played each time a new question mounts.
// "forward" enters from the right (Next), "backward" enters from the left (Back).
const stepAnimationStyles = `
@keyframes stepSlideInForward {
  from { opacity: 0; transform: translateX(28px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes stepSlideInBackward {
  from { opacity: 0; transform: translateX(-28px); }
  to { opacity: 1; transform: translateX(0); }
}
.step-forward { animation: stepSlideInForward 320ms cubic-bezier(0.16, 1, 0.3, 1); }
.step-backward { animation: stepSlideInBackward 320ms cubic-bezier(0.16, 1, 0.3, 1); }
`;

// ---------------------------------------------------------------------------
// Main component — full-screen, one question at a time, Typeform-style
// ---------------------------------------------------------------------------

export default function NewMemberForm() {
  const form = useForm<IMemberFormSchema>({
    resolver: zodResolver(MemberFormSchema) as Resolver<IMemberFormSchema>,
    defaultValues,
    mode: "onTouched",
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [submitted, setSubmitted] = useState<IMemberFormSchema | null>(null);

  const dob = form.watch("dob");
  const age = useMemo(() => calculateAge(dob), [dob]);

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
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-zinc-300"></span>
        {!submitted && (
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-zinc-400">
              Step {currentIndex + 1} - {steps.length}
            </span>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-zinc-50 transition-all"
                style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
             <ModeToggle2 />
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
            {(calculateAge(submitted.dob) ?? 0) < 18 ? "Junior" : "Senior"} member.
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
                className="rounded-full h-16 w-16 dark:bg-white bg-black px-6 text-white dark:text-black hover:text-black hover:bg-white"
              >
                {isLastStep ? <SendHorizontal size={"md"} /> : <MoveRight size={25} />}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Renders the single input for whichever field is the "current question"
// ---------------------------------------------------------------------------

function underlineClass(hasError?: boolean) {
  return cn(
    "h-15 rounded-none shadow-none dark:bg-accect p-0 text-2xl md:text-3xl sm:py-2 text-black dark:text-white",
    "placeholder:text-white border-0 border-b border-black dark:border-white",
    // neutralize shadcn's default invalid ring/box so only the bottom line changes color
    "outline-hidden ring-0 ring-offset-0",
    "focus:outline-hidden focus:ring-0",
    "focus-visible:outline-hidden focus-visible:ring-0",
    "aria-invalid:ring-0 aria-invalid:ring-offset-0 aria-invalid:shadow-none focus-visible:outline-hidden",
    hasError
      ? "border-red-500 focus-visible:border-red-500 aria-invalid:border-red-500"
      : "focus:border-0 focus:border-b focus:border-black dark:focus:border-white"+"focus-visible:border-b focus-visible:border-white dark:focus-visible:border-black"
  );
}

const QuestionLabel = ({ step }: { step: { id: string, label: string } }) => (
  <FieldLabel htmlFor={step.id} className="text-4xl sm:text-6xl font-bold leading-snug dark:text-white text-black">
    {step.label}
  </FieldLabel>
);

function StepField({
  step,
  form,
}: {
  step: StepDef;
  form: ReturnType<typeof useForm<IMemberFormSchema>>;
}) {
  const { register, setValue, watch, formState } = form;
  const error = formState.errors[step.id]?.message as string | undefined;

  switch (step.id) {
    case "fullName":
    case "fatherName":
    case "address":
    case "jurisdiction":
    case "city":
    case "formBNumber":
    case "institution":
    case "progressDegree":
    case "profession":
    case "company":
    case "designation":
    case "emergencyContactName":
    case "highestEducation":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Input id={step.id} className={underlineClass(!!error)} aria-invalid={!!error} {...register(step.id)} />
          {step.description && <FieldDescription className="text-zinc-400">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    case "cnicNumber":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Input
            id={step.id}
            autoFocus
            placeholder="12345-1234567-1"
            className={underlineClass(!!error)}
            aria-invalid={!!error}
            {...register(step.id)}
          />
          {step.description && <FieldDescription className="text-zinc-400">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    case "contactNumber":
    case "emergencyContactNumber":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Input
            id={step.id}
            type="tel"
            autoFocus
            placeholder="+923001234567"
            className={underlineClass(!!error)}
            aria-invalid={!!error}
            {...register(step.id)}
          />
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    case "email":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Input id={step.id} type="email" autoFocus className={underlineClass(!!error)} aria-invalid={!!error} {...register(step.id)} />
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    case "yearOfCompletion":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Input
            id={step.id}
            type="number"
            autoFocus
            className={underlineClass(!!error)}
            aria-invalid={!!error}
            {...register(step.id, { valueAsNumber: true })}
          />
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    case "gender":
      return <AskGenderForm error={error} setValue={setValue} step={step} watch={watch} />;

    case "educationStatus":
      return <AskEducationForm error={error} setValue={setValue} step={step} watch={watch} />;

    case "province":
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Select value={watch("province")} onValueChange={(v) => setValue("province", v, { shouldValidate: true })}>
            <SelectTrigger className={cn(underlineClass(!!error), "w-full")}>
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900 text-zinc-50">
              {PROVINCES.map((p) => (
                <SelectItem key={p} value={p} className="focus:bg-zinc-800 focus:text-zinc-50">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );

    case "dob": {
      const dobValue = watch("dob");
      return (
        <Field data-invalid={!!error} className="gap-4">
          <QuestionLabel step={step} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dob"
                type="button"
                variant="ghost"
                className={cn(underlineClass(!!error), "w-full justify-start px-0 hover:bg-transparent", !dobValue && "text-zinc-600")}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {dobValue ? format(dobValue, "PPP") : "Select date of birth"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-zinc-700 bg-zinc-900 p-0 text-zinc-50">
              <Calendar
                mode="single"
                selected={dobValue}
                onSelect={(date) => date && setValue("dob", date, { shouldValidate: true })}
                captionLayout="dropdown"
                // fromYear={1930}
                // toYear={new Date().getFullYear()}
                disabled={(date) => date > new Date()}
              />
            </PopoverContent>
          </Popover>
          {step.description && <FieldDescription className="text-zinc-400">{step.description}</FieldDescription>}
          {error && <FieldError className="text-red-400">{error}</FieldError>}
        </Field>
      );
    }

    default:
      return null;
  }
}



function AskGenderForm(
  { error, step, setValue, watch }:
    { error: string | undefined, step: { id: string, label: string }, setValue: UseFormSetValue<IMemberFormSchema>, watch: WatchDefaultValue<"gender"> }
) {

  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <RadioGroup
        value={watch("gender")}
        onValueChange={(v) => setValue("gender", v as IMemberFormSchema["gender"], { shouldValidate: true })}
        className="flex gap-3"
      >
        {(["male", "female"] as const).map((g) => (
          <label
            key={g}
            htmlFor={`gender-${g}`}
            className={cn(
              "cursor-pointer rounded-full w-35 h-35 flex justify-center items-center border px-5 py-2.5 text-2xl md:text-3xl capitalize transition-colors",
              watch("gender") === g
                ? "border-white bg-white text-black dark:border-white"
                : "border-black text-black hover:bg-black hover:text-white"
            )}
          >
            <RadioGroupItem value={g} id={`gender-${g}`} className="sr-only hidden" />
            {g}
          </label>
        ))}
      </RadioGroup>
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  )
}


function AskEducationForm(
  { error, step, setValue, watch }:
    { error: string | undefined, step: { id: string, label: string }, setValue: UseFormSetValue<IMemberFormSchema>, watch: WatchDefaultValue<"educationStatus"> }
) {

  return (
    <Field data-invalid={!!error} className="gap-4">
      <QuestionLabel step={step} />
      <RadioGroup
        value={watch("educationStatus")}
        onValueChange={(v) =>
          setValue("educationStatus", v as IMemberFormSchema["educationStatus"], { shouldValidate: true })
        }
        className="flex gap-3"
      >
        {(["completed", "anticipated"] as const).map((s) => (
          <label
            key={s}
            htmlFor={`status-${s}`}
            className={cn(
              "cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium capitalize transition-colors",
              watch("educationStatus") === s
                ? "border-zinc-50 bg-zinc-50 text-zinc-900"
                : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            )}
          >
            <RadioGroupItem value={s} id={`status-${s}`} className="sr-only" />
            {s}
          </label>
        ))}
      </RadioGroup>
      {error && <FieldError className="text-red-400">{error}</FieldError>}
    </Field>
  )
}