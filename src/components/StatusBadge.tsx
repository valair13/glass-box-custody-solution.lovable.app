import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "initiated" | "approvals" | "hsm-signed" | "broadcasted" | "confirmed" | "settled" | 
          "under-review" | "cleared" | "blocked" | "low" | "medium" | "high" | "pending" |
          "low-risk" | "medium-risk" | "high-risk";
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
  "under-review": "bg-[#E8EEFA] text-[#1E3A8A] border-transparent",
  "cleared": "bg-[#E8F6EE] text-[#16A34A] border-transparent",
  "blocked": "bg-[#FCECEC] text-[#DC2626] border-transparent",
  "low": "bg-success/10 text-success border-success/20",
  "medium": "bg-warning/10 text-warning-foreground border-warning/20",
  "high": "bg-destructive/10 text-destructive border-destructive/20",
  "pending": "bg-muted text-muted-foreground border-border",
  "low-risk": "bg-[#E8F6EE] text-[#15803D] border-transparent",
  "medium-risk": "bg-[#FFF8E1] text-[#D97706] border-transparent",
  "high-risk": "bg-[#FCECEC] text-[#DC2626] border-transparent",
};

export default function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const isRiskBadge = status.includes("-risk");
  
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        "text-[11px] px-3 h-[28px]",
        isRiskBadge ? "" : "uppercase",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
