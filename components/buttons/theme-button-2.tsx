"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button" 
import { ButtonGroup } from "../ui/button-group"

export function ModeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <React.Fragment>
      <ButtonGroup>
        <Button variant={"nothing"} className="text-foreground" onClick={() => setTheme("light")}>
          <Moon />
        </Button>
        <Button variant={"nothing"} className="text-foreground" onClick={() => setTheme("dark")}>
          <Sun />
        </Button>
      </ButtonGroup>
    </React.Fragment>
  )
}
