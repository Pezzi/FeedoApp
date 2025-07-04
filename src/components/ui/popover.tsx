// src/components/ui/popover.tsx

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

// Exporta os componentes base do Radix para que possamos usá-los em outros lugares
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

// Criamos nosso PopoverContent customizado, já com o nosso estilo
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      // Aqui aplicamos o nosso design system!
      className={`z-50 w-auto rounded-xl border border-[#1E1E1E] bg-fundo-card p-0 shadow-lg outline-none ${className}`}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }