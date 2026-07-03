"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./buttons/theme-button";
import React from "react";

interface Chunk {
  name: string;
  href: string;
}

export default function NavBreadcrumbs() {
  const pathname = usePathname();

  // Strip query string, split into segments, drop empty strings
  // (handles leading "/" and any trailing "/").
  const segments = pathname.split("?")[0].split("/").filter(Boolean);

  // Build cumulative hrefs: /dashboard, /dashboard/students, /dashboard/students/1, ...
  const chunks: Chunk[] = segments.map((name, i) => ({
    name,
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <div className="flex justify-between items-center">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {chunks.map((chunk, i) => {
                const isLast = i === chunks.length - 1;
                return (
                  <React.Fragment key={chunk.href}>
                    <BreadcrumbItem className="hidden md:block">
                      {isLast ? (
                        <BreadcrumbPage className="capitalize">
                          {chunk.name}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={chunk.href} className="capitalize">
                            {chunk.name}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="px-4">
        <ModeToggle />
      </div>
    </div>
  );
}