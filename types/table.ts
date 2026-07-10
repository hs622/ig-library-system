export type SortDirection = "asc" | "desc";

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface ColumnDef<TData> {
  key: string;
  header: string;
  cell?: (row: TData) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationState;
  sort?: SortState;
  caption?: string;
  emptyMessage?: string;
}

export interface ServerTableParams {
  page?: number;
  pageSize?: number;
  sortColumn?: string;
  sortDirection?: SortDirection;
  search?: string;
}

export interface ServerTableResult<TData> {
  data: TData[];
  total: number;
  page: number;
  pageSize: number;
}

