"use client";

import { Button } from "@/components/ui/button";
import { useBookCount } from "@/hooks/use-bookCount";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Home() {
  const { count, error, status } = useBookCount()

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col justify-between">
        <h1 className="text-3xl font-bold">Inaara Garden Library System</h1>
        <Button variant={"link"} className="cursor-pointer" asChild>
          <Link href="/temp" >
            Process to dashboard
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
        {/* Status indicator dot */}
        <span
          className={[
            "h-2 w-2 rounded-full shrink-0 transition-colors duration-300",
            status === "connected" ? "bg-emerald-500 animate-pulse" : "",
            status === "connecting" ? "bg-amber-400 animate-pulse" : "",
            status === "error" ? "bg-red-400 animate-pulse" : "",
            status === "closed" ? "bg-neutral-300" : "",
          ].join(" ")}
          aria-hidden="true"
        />

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Total Books
          </span>

          {count !== null ? (
            <span className="text-2xl font-semibold tabular-nums text-neutral-900">
              {count.toLocaleString()}
            </span>
          ) : (
            <span className="text-2xl font-semibold text-neutral-300">—</span>
          )}

          {error && (
            <span className="mt-1 text-xs text-red-500 truncate" role="alert">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
