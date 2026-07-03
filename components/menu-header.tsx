"use client";

import { IconInnerShadowTop } from "@tabler/icons-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";

export default function SidebarMenuHeader() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:p-1.5!"
        >
          <Link href="/dashboard">
            <IconInnerShadowTop className="size-5!" />
            <span className="text-base font-semibold">IG library system.</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}