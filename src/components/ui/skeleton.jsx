// Updated: 2025-12-27
import { cn } from "@/lib/utils";
function Skeleton({ className, ...props }) {
    return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props}/>;
}
export { Skeleton };
