
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        secondary:
          "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline:
          "text-foreground border-gray-200 bg-gray-100 hover:bg-gray-200",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        contabilizado: 
          "border-transparent bg-teal-500 text-white hover:bg-teal-600",
        pendente:
          "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        parcial:
          "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        pago:
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
