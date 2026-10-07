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
import { BotIcon, BookOpenIcon, FrameIcon, PieChartIcon, MapIcon, LayoutDashboardIcon, UsersRound, FileStack } from "lucide-react"
import SidebarMenuHeader from "./menu-header"
import { NavUser } from "./nav-user"
import { usePathname } from "next/navigation"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const pathname = usePathname()
  const chunks = pathname.replace("/", "").split("/")

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/console/d",
        icon: (<LayoutDashboardIcon />),
        isActive: Boolean(chunks[0] == "d"),
        nested: false,
        items: []
      },
      {
        title: "Circulation Control",
        url: "/console/cc",
        icon: (<BotIcon />),
        isActive: Boolean(chunks[0] == "cc"),
        items: [
          {
            title: "Issue and return",
            url: "/console/cc/issue-and-return",
            isActive: Boolean(chunks[1] == "")
          }, 
          {
            title: "Holds & Reservations",
            url: "/console/cc/holds-reservations",
            isActive: Boolean(chunks[1] == "")
          },
        ],
      },
      {
        title: "Cataloging & Inventory",
        url: "/console/ci",
        icon: (<BookOpenIcon />),
        isActive: Boolean(chunks[0] == "ci"),
        items: [
          {
            title: "Book Inventory",
            url: "/console/ci/book-inventory",
            isActive: Boolean( chunks[1] == "book-inventory")
          }, 
          {
            title: "Categories",
            url: "/console/ci/categories",
            isActive: Boolean( chunks[1] == "categories")
          }
        ],
      },
      {
        title: "Member Management",
        url: "/console/mm",
        icon: (<UsersRound />),
        isActive: Boolean(chunks[0] == "mm"),
        items: [
          {
            title: "Members",
            url: "/console/mm/members",
            isActive: Boolean(chunks[1] == "members")
          },
        ],
      },
      {
        title: "Content Management",
        url: "/cm",
        icon: (<FileStack />),
        isActive: Boolean(chunks[0] == "cm"),
        items: [
          {
            title: "Articles",
            url: "/cm/articles",
            isActive: Boolean(chunks[1] == "articles")
          },
          {
            title: "Announcements",
            url: "/cm/announcements",
            isActive: Boolean(chunks[1] == "announcement")
          },
        ],
      },
      // {
      //   title: "Settings & Configurations",
      //   url: "/sc",
      //   icon: (<Settings2Icon />),
      //   isActive: Boolean(chunks[0] == "sc"),
      //   items: [
      //     {
      //       title: "General",
      //       url: "#",
      //       isActive: Boolean(chunks[1] == "")
      //     },
      //     {
      //       title: "Team",
      //       url: "#",
      //       isActive: Boolean(chunks[1] == "")
      //     },
      //     {
      //       title: "Billing",
      //       url: "#",
      //       isActive: Boolean(chunks[1] == "")
      //     },
      //     {
      //       title: "Limits",
      //       url: "#",
      //       isActive: Boolean(chunks[1] == "")
      //     },
      //   ],
      // },
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
