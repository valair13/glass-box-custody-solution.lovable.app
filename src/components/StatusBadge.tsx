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
  "cleared": "bg-[#E8F6EE] text-[#14532D] border-transparent",
  "blocked": "bg-[#F4EAEA] text-[#7A1A1A] border-transparent",
  "low": "bg-success/10 text-success border-success/20",
  "medium": "bg-warning/10 text-warning-foreground border-warning/20",
  "high": "bg-destructive/10 text-destructive border-destructive/20",
  "pending": "bg-muted text-muted-foreground border-border",
  "low-risk": "bg-[rgba(20,64,40,0.12)] text-[#144028] border-transparent",
  "medium-risk": "bg-[rgba(153,102,51,0.12)] text-[#996633] border-transparent",
  "high-risk": "bg-[rgba(128,26,26,0.12)] text-[#801A1A] border-transparent",
};

export default function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const isRiskBadge = status.includes("-risk");
  
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold",
        "text-[12px] px-3 h-[28px]",
        isRiskBadge ? "" : "uppercase",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
