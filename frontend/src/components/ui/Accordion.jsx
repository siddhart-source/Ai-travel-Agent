import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

const Accordion = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {children}
  </div>
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef(({ className, title, children, defaultOpen = false, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div ref={ref} className={cn("border border-border/50 rounded-lg overflow-hidden bg-card text-card-foreground", className)} {...props}>
      <button
        type="button"
        className="flex w-full items-center justify-between p-4 font-medium transition-all hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="p-4 pt-2 border-t border-border/50 bg-background/20 text-sm text-muted-foreground whitespace-pre-wrap font-mono">
          {children}
        </div>
      )}
    </div>
  )
})
AccordionItem.displayName = "AccordionItem"

export { Accordion, AccordionItem }
