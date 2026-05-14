import { useEffect, useState } from "react"
import { MenuIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/marketing/Logo"
import { cn } from "@/lib/utils"

const menuItems = [
  { name: "Product", href: "/product" },
  { name: "Methodology", href: "/product/methodology" },
  { name: "About", href: "/about" },
]

export function HeroHeader() {
  const [menuState, setMenuState] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuState ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuState])

  return (
    <header>
      <nav
        data-state={menuState ? "active" : undefined}
        className="fixed top-0 z-30 w-full border-b border-border bg-background/50 backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a
                href="/"
                aria-label="Vental home"
                className="flex items-center"
              >
                <Logo />
              </a>

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close menu" : "Open menu"}
                aria-expanded={menuState}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <MenuIcon
                  className={cn(
                    "m-auto size-6 transition-all duration-200",
                    "in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0",
                  )}
                />
                <XIcon
                  className={cn(
                    "absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 transition-all duration-200",
                    "in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100",
                  )}
                />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="block text-muted-foreground transition-colors duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={cn(
                "mb-6 hidden w-full flex-wrap items-center justify-end gap-8 rounded-3xl border border-border bg-background p-6 shadow-2xl shadow-zinc-300/20",
                "in-data-[state=active]:block",
                "md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent",
              )}
            >
              <div className="lg:hidden">
                <ul className="flex flex-col gap-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="block text-muted-foreground transition-colors duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-fit md:items-center">
                <Button asChild size="sm">
                  <a href="mailto:hello@vental.ai">
                    <span>Book a demo</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
