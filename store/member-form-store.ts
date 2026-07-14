"use client";

import { create } from "zustand";
import { IMemberFormSchema } from "@/types/zod";

export type StepDirection = "forward" | "backward";

// export const defaultMemberFormValues: Partial<IMemberFormSchema> = {
//   gender: undefined, 
//   partOfReadingClub: undefined 
// };

interface MemberFormUIState {
  stepIndex: number;
  direction: StepDirection;
  submitted: IMemberFormSchema | null;
  dateOfBirth: Date | null;
  /** Live mirror of RHF's field values, kept in sync via form.watch. */
  formData: Partial<IMemberFormSchema>;

  setDateOfBirth: (date: Date | null) => void;
  setSubmitted: (values: IMemberFormSchema | null) => void;

  /** Overwrite the whole form snapshot (used by the watch subscription). */
  setFormData: (values: Partial<IMemberFormSchema>) => void;
  /** Patch a single field. */
  updateField: <K extends keyof IMemberFormSchema>(field: K, value: IMemberFormSchema[K]) => void;

  goToStep: (index: number) => void;
  goNext: (lastIndex: number) => void;
  goBack: () => void;

  /** Jumps back to the very first step from anywhere in the flow. */
  skipToFirstStep: () => void;

  /** Resets step/submission state AND the stored form values. */
  resetForm: () => void;
}

const initialState = {
  stepIndex: 0,
  direction: "forward" as StepDirection,
  submitted: null,
  dateOfBirth: null,
  formData: {}
};

export const useMemberFormStore = create<MemberFormUIState>((set) => ({
  ...initialState,

  setDateOfBirth: (date) => set({ dateOfBirth: date }),
  setSubmitted: (values) => set({ submitted: values }),

  setFormData: (values) => set({ formData: values }),
  updateField: (field, value) =>
    set((state) => ({ formData: { ...state.formData, [field]: value } })),

  goToStep: (index) =>
    set((state) => ({
      stepIndex: index,
      direction: index >= state.stepIndex ? "forward" : "backward",
    })),

  goNext: (lastIndex) =>
    set((state) => ({
      stepIndex: Math.min(state.stepIndex + 1, lastIndex),
      direction: "forward",
    })),

  goBack: () =>
    set((state) => ({
      stepIndex: Math.max(state.stepIndex - 1, 0),
      direction: "backward",
    })),

  skipToFirstStep: () => set({ stepIndex: 0, direction: "backward" }),

  resetForm: () => set({ ...initialState, formData: {} }),
}));