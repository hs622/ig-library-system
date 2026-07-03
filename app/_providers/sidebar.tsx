"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}