import { IBookTableColumnType } from "@/types/book.zod";
import { RowSelectionState, Updater } from "@tanstack/react-table";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

interface BookTableState {
  data: IBookTableColumnType[] | [];
  total: number;

  page: number;
  pageSize: number;

  sortBy: string | null;
  sortOrder: "asc" | "desc";
  rowSelection: RowSelectionState;

  isLoading: boolean;
  error: string | null;

  cursor: string | null;
  hasMore: boolean;

  // Action
  setData: (data: IBookTableColumnType[]) => void;
  setTotal: (total: number) => void;

  setCursor: (cursorId: string | null) => void;
  setHasMore: (hasMore: boolean) => void;

  setPage: (page: number) => void;
  setPageSize: (page: number) => void;
  setSorting: (sortBy: string | null, sortOrder: "asc" | "desc") => void;

  setRowSelection: (updater: Updater<RowSelectionState>) => void;
  clearSelection: () => void;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  reset: () => void;
}

const initialState = {
  data: [],
  total: 0,

  page: 1,
  pageSize: 20,

  sortBy: null,
  sortOrder: "desc" as const,

  rowSelection: {},

  isLoading: false,
  error: null,

  cursor: null,
  hasMore: false,
};

export const useBookTableStore = create<BookTableState>((set) => ({
  ...initialState,

  setData: (data) => set({ data }),
  setTotal: (total) => set({ total }),

  setCursor: (cursor) => set({ cursor }),
  setHasMore: (hasMore) => set({ hasMore }),

  setPage: (page) => set({ page }),
  setPageSize: (pageSize) =>
    set({
      pageSize,
      page: 1,
    }),

  setSorting: (sortBy, sortOrder) =>
    set({
      sortBy,
      sortOrder,
      page: 1,
    }),

  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === "function" ? updater(state.rowSelection) : updater,
    })),

  clearSelection: () => set({ rowSelection: {} }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  reset: () =>
    set({
      ...initialState,
    }),
}));

export const useSelectedResourceIds = () => useBookTableStore(
  useShallow(s => Object.keys(s.rowSelection).filter(id => s.rowSelection[id]))
)

