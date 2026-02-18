import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                destructive: "bg-destructive text-white",
                outline: "border-border text-foreground",
                success: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
    return (
        <span
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
