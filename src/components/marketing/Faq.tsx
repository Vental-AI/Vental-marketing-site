import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    q: "How is Vental different from a traditional appraisal tool?",
    a: "Vental is purpose-built around comparable public-record data and the tax estimation workflow. It produces a defensible estimate with the comps, weights, and adjustments attached — not just a number.",
  },
  {
    q: "Where does the data come from?",
    a: "Vental ingests data from state, county, and municipal sources. We refresh continuously so you're not working from a stale export.",
  },
  {
    q: "Which jurisdictions are supported?",
    a: "For now, Vental supports the major metroplitan areas of Florida. We are growing rapidly and plan to cover NY, Texas, California, and others soon.",
  },
  {
    q: "Can I bring my own comps?",
    a: "Yes. You can pin specific properties as comps, exclude others, and adjust the weights Vental uses — without leaving the workspace.",
  },
  {
    q: "Is my workspace data isolated?",
    a: "Every customer gets a tenant-isolated workspace at {workspace}.vental.ai",
  },
  {
    q: "Do you offer an API?",
    a: "Enterprise customers have access to a programmatic API for valuations and comps. Talk to sales to scope an integration.",
  },
]

export function Faq() {
  return (
    <Accordion type="single" collapsible className="bg-card">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>
            <p className="text-muted-foreground">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
