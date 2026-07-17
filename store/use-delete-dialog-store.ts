import { create } from "zustand";

interface DeleteResourceDialogProps {
  title: string;
  resourceId: string;
  module: string;
}

interface DeleteDialogState {
  isOpen: boolean;
  resource: DeleteResourceDialogProps | null;
  openDialog: (data: DeleteResourceDialogProps) => void;
  closeDialog: () => void;
}

interface DeleteBulkDialogState {
  isOpen: boolean;
  resource: { title: string, module: string } | null;
  openDialog: (data: { title: string, module: string }) => void;
  closeDialog: () => void;
}

export const useDeleteDialogStore = create<DeleteDialogState>((set) => ({
  isOpen: false,
  resource: null,
  openDialog: (data) => set({ isOpen: true, resource: data }),
  closeDialog: () => set({ isOpen: false }),
}));

export const useDeleteBulkDialogStore = create<DeleteBulkDialogState>((set) => ({
  isOpen: false,
  resource: null,
  openDialog: (data) => set({ isOpen: true, resource: data }),
  closeDialog: () => set({ isOpen: false }),
}))