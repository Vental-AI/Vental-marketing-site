import { useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export interface FeatureItem {
  id: number
  title: string
  image: string
  description: string
}

interface Props {
  features: FeatureItem[]
  className?: string
}

export function FeaturesAccordion({ features, className }: Props) {
  const firstId = features[0]?.id ?? 1
  const defaultItem = `item-${firstId}`
  const [activeId, setActiveId] = useState<number>(firstId)
  const activeImage =
    features.find((f) => f.id === activeId)?.image ?? features[0].image

  function onValueChange(value: string) {
    if (!value) return
    const id = Number.parseInt(value.replace("item-", ""), 10)
    if (!Number.isNaN(id)) setActiveId(id)
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-8 md:flex-row md:gap-12",
        className,
      )}
    >
      <div className="w-full md:w-1/2">
        <Accordion
          type="single"
          collapsible
          defaultValue={defaultItem}
          onValueChange={onValueChange}
          className="w-full border-0"
        >
          {features.map((tab) => (
            <AccordionItem
              key={tab.id}
              value={`item-${tab.id}`}
              className="transition-opacity"
            >
              <AccordionTrigger className="cursor-pointer py-5">
                <span
                  className={cn(
                    "text-left text-xl",
                    tab.id === activeId
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {tab.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <p className="text-base text-muted-foreground">
                  {tab.description}
                </p>
                <div className="mt-4 md:hidden">
                  <img
                    src={tab.image}
                    alt={tab.title}
                    loading="lazy"
                    className="max-h-80 w-full rounded-md object-cover"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="relative hidden w-1/2 overflow-hidden rounded-xl border border-border bg-muted md:block">
        <div className="relative aspect-[4/3]">
          {features.map((f) => (
            <img
              key={f.id}
              src={f.image}
              alt={f.title}
              loading="lazy"
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-500",
                activeImage === f.image ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
