import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import SidebarWrapper from "../_providers/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import NavBreadcrumbs from "@/components/nav-breadcrumbs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarWrapper>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden flex flex-col">
        <NavBreadcrumbs />
        {children}
      </SidebarInset>
    </SidebarWrapper>
  )
}