// hooks/useCategories.ts
"use client";

import React from "react";
import debounce from "lodash.debounce";

// Splits "a,b,c" into "a" | "b" | "c"
type SplitFields<S extends string> =
  S extends `${infer Head},${infer Rest}`
    ? Head | SplitFields<Rest>
    : S

// Builds { [field]: string } from the parsed field names
type FieldsFromSelect<S extends string> = {
  [K in SplitFields<S>]: string
}

interface UseCategoriesParams<S extends string> {
  params?: { select: S } & QueryParams
  search?: string
  searchParams?: QuerySearchParams
  debounceMs?: number
  enabled?: boolean
  minSearchLength?: number
}

interface UseCategoriesResult<S extends string> {
  categories: FieldsFromSelect<S>[] | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

type QueryParams = Record<string, string | number | boolean | undefined>
type QuerySearchParams = URLSearchParams | Record<string, string | undefined>

function buildQuery(
  params: QueryParams | undefined,
  search: string | undefined,
  searchParams: QuerySearchParams | undefined,
) {
  const qs = new URLSearchParams()

  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => qs.set(key, value))
  } else if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) qs.set(key, value)
    })
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) qs.set(key, String(value))
    })
  }

  if (search !== undefined) qs.set("search", search)

  return qs.toString()
}

export function useCategories<S extends string>({
  params,
  search,
  searchParams,
  debounceMs = 500,
  enabled = true,
  minSearchLength = 0,
}: UseCategoriesParams<S>): UseCategoriesResult<S> {
  type Item = FieldsFromSelect<S>

  const [categories, setCategories] = React.useState<Item[] | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const abortRef = React.useRef<AbortController | null>(null)
  const latestArgs = React.useRef({ params, searchParams })

  React.useEffect(() => {
    latestArgs.current = { params, searchParams }
  })

  const isSearchTooShort =
    search !== undefined && search.length < minSearchLength

  const runFetch = React.useCallback(
    async (searchValue: string | undefined) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const query = buildQuery(
        latestArgs.current.params,
        searchValue,
        latestArgs.current.searchParams,
      );

      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`/api/categories${query ? `?${query}` : ""}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search Failed");

        const json = await res.json();
        setCategories((json.categories ?? null) as Item[] | null)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Search Failed, please try again.");
      } finally {
  if (!controller.signal.aborted) setIsLoading(false)
}
    },
    [],
  );

  const debouncedFetchRef = React.useRef<ReturnType<typeof debounce> | null>(null)

  React.useEffect(() => {
    debouncedFetchRef.current = debounce(runFetch, debounceMs)
    return () => {
      debouncedFetchRef.current?.cancel()
    }
  }, [runFetch, debounceMs])

  // addons for first search.
  const isFirstSearchRender = React.useRef(true)

  React.useEffect(() => {
    if (!enabled || isSearchTooShort) return
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false
      return // initial load is handled by the params effect below
    }
    debouncedFetchRef.current?.(search)
  }, [search, enabled, isSearchTooShort])
  // and for first search.

  React.useEffect(() => {
    if (!enabled || isSearchTooShort) return
    debouncedFetchRef.current?.(search)
  }, [search, enabled, isSearchTooShort])

  React.useEffect(() => {
    if (!enabled || isSearchTooShort) return
    const timeoutId = setTimeout(() => runFetch(search), 0)
    return () => clearTimeout(timeoutId)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), JSON.stringify(searchParams instanceof URLSearchParams ? Array.from(searchParams.entries()) : searchParams)])

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const refetch = React.useCallback(() => runFetch(search), [runFetch, search])

  // categories is only meaningful when the search actually qualifies to run —
  // otherwise present "no results" without ever having called setState for it
  const resolvedCategories = isSearchTooShort ? null : categories

  return { categories: resolvedCategories, isLoading, error, refetch }
}

