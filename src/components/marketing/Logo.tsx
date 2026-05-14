import { CuboidIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
    >
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground"
      >
        <CuboidIcon className="size-3.5" />
      </span>
      <span className="tracking-tight">Vental</span>
    </span>
  )
}
