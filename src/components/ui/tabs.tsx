import * as React from "react"
import { cn } from "@/lib/utils"

function Tabs({ className, ...props }: React.ComponentProps<"div"> & { defaultValue?: string; value?: string; onValueChange?: (v: string) => void }) {
    return <div data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="tabs-list"
            className={cn("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1", className)}
            {...props}
        />
    )
}

function TabsTrigger({
    className,
    active,
    ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
    return (
        <button
            data-slot="tabs-trigger"
            className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all cursor-pointer",
                active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                className
            )}
            {...props}
        />
    )
}

function TabsContent({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
