import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import SidebarWrapper from "../_providers/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import NavBreadcrumbs from "@/components/nav-breadcrumbs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <SidebarWrapper>
      <AppSidebar user={session?.user ?? null} />
      <SidebarInset className="h-dvh sm:h-screen overflow-hidden flex flex-col">
        <NavBreadcrumbs />
        {children}
      </SidebarInset>
    </SidebarWrapper>
  )
}