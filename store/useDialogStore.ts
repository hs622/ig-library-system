import { create } from "zustand";

export interface Resource {
  module?: string,
  resourceId?: string,
  resourceIds?: string[],
}

export interface DialogState {
  isOpen: boolean;
  isLoading: boolean;
  resource: Resource | null;
  closeDialog: () => void;
  openDialog: (data: Resource) => void;
  setIsLoading: (state: boolean) => void;
}

export const useDialog = create<DialogState>((set) => ({
  isOpen: false,
  isLoading: false,
  resource: null,
  closeDialog: () => set({ isOpen: false }),
  openDialog: (data) => set({ isOpen: true, resource: data }),
  setIsLoading: (state) => set({ isLoading: state })
}));
