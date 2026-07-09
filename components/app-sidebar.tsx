"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, LayoutDashboardIcon, UsersRound } from "lucide-react"
import SidebarMenuHeader from "./menu-header"
import { NavUser } from "./nav-user"
import { usePathname } from "next/navigation"

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const pathname = usePathname()
  const chunks = pathname.replace("/", "").split("/")

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/d",
        icon: (<LayoutDashboardIcon />),
        isActive: Boolean(chunks[0] == "d"),
        nested: false,
        items: []
      },
      {
        title: "Circulation Control",
        url: "/cc",
        icon: (<BotIcon />),
        isActive: Boolean(chunks[0] == "cc"),
        items: [
          {
            title: "Issue Book",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Return Book",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Holds & Reservations",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
        ],
      },
      {
        title: "Cataloging & Inventory",
        url: "/ci",
        icon: (<BookOpenIcon />),
        isActive: Boolean(chunks[0] == "ci"),
        items: [
          {
            title: "Book Inventory",
            url: "/ci/book-inventory",
            isActive: Boolean( chunks[1] == "book-inventory")
          },
          // {
          //   title: "Acquisitions",
          //   url: "#",
          // isActive: Boolean(chunks[1] == "")
          // },
          {
            title: "Categories",
            url: "/ci/categories",
            isActive: Boolean( chunks[1] == "categories")
          }
        ],
      },
      {
        title: "Member Management",
        url: "/mm",
        icon: (<UsersRound />),
        isActive: Boolean(chunks[0] == "mm"),
        items: [
          {
            title: "General",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Team",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Billing",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Limits",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
        ],
      },
      {
        title: "Settings & Configurations",
        url: "/sc",
        icon: (<Settings2Icon />),
        isActive: Boolean(chunks[0] == "sc"),
        items: [
          {
            title: "General",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Team",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Billing",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
          {
            title: "Limits",
            url: "#",
            isActive: Boolean(chunks[1] == "")
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: (
          <FrameIcon
          />
        ),
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: (
          <PieChartIcon
          />
        ),
      },
      {
        name: "Travel",
        url: "#",
        icon: (
          <MapIcon
          />
        ),
      },
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: "Hussain Ali",
          username: "hussainalee",
          avatar: "#"
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
