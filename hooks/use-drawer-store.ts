import { BookRow } from "@/app/(administrator)/ci/book-inventory/datatable/columns";
import { create } from "zustand";

interface DrawerState {
  isOpen: boolean;
  selectedBook: BookRow | null;
  openDrawer: (book: BookRow) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  selectedBook: null,
  openDrawer: (book) => set({ isOpen: true, selectedBook: book }),
  closeDrawer: () => set({ isOpen: false, selectedBook: null }),
}));
