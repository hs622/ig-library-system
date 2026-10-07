import { create } from "zustand";

interface drawerState {
  isOpen: boolean;

  width: number | undefined;
  height: number | undefined;

  direction: "up" | "down" | "right" | "left";
  model: boolean;

  // Action
  openDrawer: () => void;
  closeDrawer: () => void;

  setWidth: (width: number) => void;
  setHeight: (height: number) => void;

  setModel: (value: boolean) => void;
  setDirection: (value: "up" | "down" | "right" | "left") => void;
}

const initialState: Pick<
  drawerState,
  "isOpen" | "direction" | "height" | "width" | "model"
> = {
  isOpen: false,
  width: undefined,
  height: undefined,

  direction: "left",
  model: false,
};

export const useDrawerGlobalStore = create<drawerState>((set) => ({
  ...initialState,

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  setWidth: (width) => set({ width }),
  setHeight: (height) => set({ height }),

  setModel: (value) => set({ model: value }), 
  setDirection: (direction) => set({ direction })
}));

