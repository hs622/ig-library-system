import { IBookSchema } from "@/types/book.zod";
import { create } from "zustand";

interface DrawerState {
  isOpen: boolean;
  selectedBook: IBookSchema & { _id: string } | null;
  openDrawer: (book: IBookSchema & { _id: string }) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  selectedBook: null,
  openDrawer: (book) => set({ isOpen: true, selectedBook: book }),
  closeDrawer: () => set({ isOpen: false, selectedBook: null }),
}));
