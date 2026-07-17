import { RowSelectionState, Updater } from "@tanstack/react-table";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

interface ResourceSelectionStore {
  rowSelection: RowSelectionState;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
  clearSelection: () => void;
}

export const useResourceSelectionStore = create<ResourceSelectionStore>((set, get) => ({
  rowSelection: {}, // initializing blank object

  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === "function" ? updater(state.rowSelection) : updater,
    })),
  clearSelection: () => set({ rowSelection: {} }),
}));

export const useSelectedResourceIds = () =>
  useResourceSelectionStore(
    useShallow((s) =>
      Object.keys(s.rowSelection).filter((id) => s.rowSelection[id]),
    ),
  );

