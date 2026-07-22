import { create } from "zustand";

export interface CreateResource {
  module: string,
  dialog: string
  resourceId: string,
}

export interface CreateDialogState {
  isOpen: boolean;
  resource: CreateResource | null;
  closeDialog: () => void;
  openDialog: (data: CreateResource) => void;
}

export const useCreateDialog = create<CreateDialogState>((set) => ({
  isOpen: false,
  resource: null,
  closeDialog: () => set({ isOpen: false }),
  openDialog: (data) => set({ isOpen: true, resource: data }),
}));
