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
  "under-review": "bg-warning/10 text-warning-foreground border-warning/20",
  "cleared": "bg-success/10 text-success border-success/20",
  "blocked": "bg-destructive/10 text-destructive border-destructive/20",
  "low": "bg-success/10 text-success border-success/20",
  "medium": "bg-warning/10 text-warning-foreground border-warning/20",
  "high": "bg-destructive/10 text-destructive border-destructive/20",
  "pending": "bg-muted text-muted-foreground border-border",
  "low-risk": "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/20",
  "medium-risk": "bg-[#FEF9C3] text-[#FACC15] border-[#FACC15]",
  "high-risk": "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/20",
};

export default function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const isRiskBadge = status.includes("-risk");
  
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold border",
        isRiskBadge ? "text-[11px]" : "text-xs uppercase",
        "w-[104px] h-[28px]",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
