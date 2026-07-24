"use client";

import { HTTP_METHOD } from "next/dist/server/web/http";
import React from "react";

interface HTTPOptions {
  method?: HTTP_METHOD;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  cache?: RequestCache;
}

interface FetchProps {
  endpoint: string;
  searchParams?: string | URLSearchParams;
  options?: HTTPOptions;
}

export function useFetch<TData>({
  endpoint,
  searchParams,
  options = { method: "GET" },
}: FetchProps) {
  const [data, setData] = React.useState<TData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean | null>(null);

  const { method, headers, credentials, cache } = options;

  // Stringify so the effect can depend on the *value*, not the object identity
  const headersKey = headers ? JSON.stringify(headers) : "";
  const searchParamsKey = searchParams?.toString() ?? "";

  const initiateRequest = React.useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const qs = searchParamsKey ? `?${searchParamsKey}` : "";
        const requestWrapper = await fetch(
          `/api${endpoint}${qs}`,
          {
            method: method ?? "GET",
            headers,
            credentials,
            cache,
            signal,
          },
        );

        if (!requestWrapper.ok) {
          setSuccess(false);
          setError(`Request failed with status ${requestWrapper.status}`);
          setData(null);
          return;
        }

        const decodedResponse = await requestWrapper.json();
        setData(decodedResponse.member);

        // // payload isn't stored in data state.
        // console.log(data);

        setSuccess(true);
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // unmount/cleanup, not a real error
        setSuccess(false);
        setError(
          err instanceof Error ? err.message : "Failed to fetch a resource.",
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, searchParamsKey, method, headersKey, credentials, cache],
  );

  React.useEffect(() => {
    const controller = new AbortController();

    queueMicrotask(() => {
      if(!controller.signal.aborted) {
        initiateRequest(controller.signal);
      }
    });
    
    return () => controller.abort();
  }, [initiateRequest]);

  // only for debugging purpose.
  React.useEffect(() => {
    console.log("data updated:", data);
  }, [data]);

  const refetch = React.useCallback(() => {
    const controller = new AbortController();
    initiateRequest(controller.signal);
  }, [initiateRequest]);

  return { data, success, isLoading, error, refetch };
}
