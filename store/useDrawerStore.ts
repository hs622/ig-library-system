import { create } from "zustand";

interface DrawerResource {
  module: string;
  dialog: string;
  resourceId: string;
}

interface useDrawerState {
  isOpen: boolean;
  isLoading: boolean;
  resource: DrawerResource | null;
  closeDrawer: () => void;
  openDrawer: (data: DrawerResource) => void;
}

export const useDrawer = create<useDrawerState>((set) => ({
  isOpen: false,
  isLoading: false,
  resource: null,
  closeDrawer: () => set({ isOpen: false }),
  openDrawer: (data) => set({ isOpen: true, resource: data }),
}));

