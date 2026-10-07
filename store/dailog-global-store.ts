import { create } from "zustand";

interface DailogGlobalState {
  isOpen: boolean;
  uniqueKey: string | null;
  size: "sm" | "md" | "lg";

  title: string | null;
  description?: string | null;

  hasNested: boolean;

  openDialog: () => void;
  closeDialog: () => void;

  setKey: (key: string) => void;
  setSize: (size: "sm" | "md" | "lg") => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setHasNested: (hasNested: boolean) => void;
}

const initialState: Pick<
  DailogGlobalState,
  "isOpen" | "uniqueKey" | "size" | "title" | "description" | "hasNested"
> = {
  isOpen: false,
  uniqueKey: null,
  size: "sm",

  title: null,
  description: null,

  hasNested: false,
};

export const useDialogGlobalStore = create<DailogGlobalState>((set) => ({
  ...initialState,

  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),

  setKey: (key: string) => set({ uniqueKey: key }),
  setSize: (size) => set({ size }),
  setTitle: (title: string) => set({ title }),
  setDescription: (description) => set({ description }),
  setHasNested: (hasNested: boolean) => set({ hasNested }),
}));

