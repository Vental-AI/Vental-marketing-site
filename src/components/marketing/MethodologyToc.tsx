import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export interface TocSection {
  id: string
  number: string
  title: string
}

interface Props {
  sections: TocSection[]
}

export function MethodologyToc({ sections }: Props) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null)

  useEffect(() => {
    const ids = sections.map((s) => s.id)
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const first = ids.find((id) => visible.has(id))
        if (first) setActive(first)
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        On this page
      </p>
      <ul className="flex flex-col gap-1.5 border-l border-border">
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={cn(
                  "-ml-px flex items-baseline gap-2 border-l-2 border-transparent py-1 pl-3 leading-snug transition-colors hover:text-foreground",
                  isActive
                    ? "border-primary font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <span className="font-mono text-[0.7rem] text-muted-foreground/80">
                  {s.number}
                </span>
                <span>{s.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
