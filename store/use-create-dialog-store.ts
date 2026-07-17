import { create } from "zustand";

export interface CreateResource {
  module: string,
  resourceId: string,
}

export interface CreateDialogState {
  isOpen: boolean;
  resource: CreateResource | null;
  closeDialog: () => void;
  openDialog: () => void;
}

export const useCreateDialog = create<CreateDialogState>((set) => ({
  isOpen: false,
  resource: null,
  closeDialog: () => set({ isOpen: false }),
  openDialog: () => set({ isOpen: true }),
}));
