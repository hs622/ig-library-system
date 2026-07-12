"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <React.Fragment>
      {theme === "light" ? (
        <Button variant={"outline"} className="text-foreground" onClick={() => setTheme("dark")}>
          <Sun />
        </Button>
      ) : (
        <Button variant={"outline"} className="text-foreground" onClick={() => setTheme("light")}>
          <Moon />
        </Button>
      )}
    </React.Fragment>
  )
}
