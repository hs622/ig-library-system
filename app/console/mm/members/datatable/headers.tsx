"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// import { useFetch } from "@/hooks/useFetch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function MemberSearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(searchParams.get("search") ?? "");

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <React.Fragment>
      <Button variant={"outline"} className="sm:hidden">
        <Search />
      </Button>
      <Input
        placeholder="Search with name"
        className="hidden sm:block max-w-60"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </React.Fragment>
  );
}

export function MemberTotalCount() {

  return (
    <div className="border rounded-md h-full w-fit sm:w-full">
      <div className="text-sm text-nowrap p-2">
        Showing 17 out 550 Member
      </div>
    </div>
  )
}
