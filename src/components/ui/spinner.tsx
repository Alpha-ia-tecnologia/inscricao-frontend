import * as React from "react"
import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("size-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
            {...props}
        />
    )
}

export { Spinner }
