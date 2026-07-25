import { cn } from "@/lib/utils"

export const GreenLamp = ({ className }: React.ComponentProps<"div">) => (
  <div className={cn("rounded-full w-4 h-4 dark:bg-green-300 bg-green-600 text-xs border", className)} ></div>
)

export const RedLamp = ({ className }: React.ComponentProps<"div">) => (
  <div className={cn("rounded-full w-4 h-4 dark:bg-red-300 bg-red-600 text-xs border", className)}></div>
)

export const YellowLamp = ({ className }: React.ComponentProps<"div">) => (
  <div className={cn("rounded-full w-4 h-4 dark:bg-yellow-300 bg-yellow-600", className)}></div>
)
