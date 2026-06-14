import { useEffect, useRef, useState } from "react";

type Status = "connecting" | "connected" | "error" | "closed";

interface UseBookCountResult {
  count: number | null;
  status: Status;
  error: string | null;
}

export function useBookCount(): UseBookCountResult {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("connecting");
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/live-stats");
    eventSourceRef.current = es;

    es.onopen = () => {
      setStatus("connected");
      setError(null);
    };

    es.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as { total: number };
        setCount(data.total);
      } catch {
        console.error("Failed to parse SSE message:", event.data);
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects on error — distinguish permanent close
      if (es.readyState === EventSource.CLOSED) {
        setStatus("closed");
        setError("Connection closed unexpectedly.");
      } else {
        setStatus("error");
        setError("Connection lost. Reconnecting…");
      }
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
      setStatus("closed");
    };
  }, []);

  return { count, status, error };
}