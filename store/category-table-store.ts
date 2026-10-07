import { ICategorySchema } from "@/types/category.zod"; 
import { create } from "zustand";

interface CategoryTableState {
  data: ICategorySchema[] | [];
  total: number;

  page: number;
  pageSize: number;

  sortBy: string | null;
  sortOrder: "asc" | "desc";
  selectedRows: string[];

  isLoading: boolean;
  error: string | null;

  cursor: string | null;
  hasMore: boolean;

  // Action
  setData: (data: ICategorySchema[]) => void;
  setTotal: (total: number) => void;

  setCursor: (cursorId: string | null) => void;
  setHasMore: (hasMore: boolean) => void;

  setPage: (page: number) => void;
  setPageSize: (page: number) => void;
  setSorting: (sortBy: string | null, sortOrder: "asc" | "desc") => void;

  setSelectedRows: (ids: string[]) => void;
  toggleRowSelection: (id: string) => void;
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

  selectedRows: [],

  isLoading: false,
  error: null,

  cursor: null,
  hasMore: false,
};

export const useCategoryTableStore = create<CategoryTableState>((set) => ({
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

  setSelectedRows: (selectedRows) => set({ selectedRows }),

  toggleRowSelection: (id) =>
    set((state) => ({
      selectedRows: state.selectedRows.includes(id)
        ? state.selectedRows.filter((rowId) => rowId !== id)
        : [...state.selectedRows, id],
    })),

  clearSelection: () =>
    set({
      selectedRows: [],
    }),

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
