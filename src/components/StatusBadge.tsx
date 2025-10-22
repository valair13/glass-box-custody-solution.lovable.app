import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "initiated" | "approvals" | "hsm-signed" | "broadcasted" | "confirmed" | "settled" | 
          "under-review" | "cleared" | "blocked" | "low" | "medium" | "high" | "pending";
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  "initiated": "bg-blue-100 text-blue-700 border-blue-200",
  "approvals": "bg-amber-100 text-amber-700 border-amber-200",
  "hsm-signed": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "broadcasted": "bg-purple-100 text-purple-700 border-purple-200",
  "confirmed": "bg-success/10 text-success border-success/20",
  "settled": "bg-success text-success-foreground border-success",
  "under-review": "bg-warning/10 text-warning-foreground border-warning/20",
  "cleared": "bg-success/10 text-success border-success/20",
  "blocked": "bg-destructive/10 text-destructive border-destructive/20",
  "low": "bg-success/10 text-success border-success/20",
  "medium": "bg-warning/10 text-warning-foreground border-warning/20",
  "high": "bg-destructive/10 text-destructive border-destructive/20",
  "pending": "bg-muted text-muted-foreground border-border",
};

export default function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
