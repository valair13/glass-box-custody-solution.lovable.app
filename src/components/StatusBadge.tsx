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
  "approvals": "bg-[#E6EEF9] text-white border-transparent",
  "hsm-signed": "bg-[#7CA6F2] text-white border-transparent",
  "broadcasted": "bg-[#3C6FE0] text-white border-transparent",
  "confirmed": "bg-[#264FAD] text-white border-transparent",
  "settled": "bg-[#1E3A8A] text-white border-transparent",
  "under-review": "bg-[#E8EEFA] text-[#1E3A8A] border-transparent",
  "cleared": "bg-[#E8EEFA] text-[#1E3A8A] border-transparent",
  "blocked": "bg-[#E8EEFA] text-[#1E3A8A] border-transparent",
  "low": "bg-success/10 text-success border-success/20",
  "medium": "bg-warning/10 text-warning-foreground border-warning/20",
  "high": "bg-destructive/10 text-destructive border-destructive/20",
  "pending": "bg-muted text-muted-foreground border-border",
  "low-risk": "bg-[#E8F6EE] text-[#166534] border-transparent",
  "medium-risk": "bg-[#F9EED2] text-[#946C1E] border-transparent",
  "high-risk": "bg-[#F8D9D9] text-[#A32323] border-transparent",
};

export default function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const isRiskBadge = status.includes("-risk");
  
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium leading-[1.2]",
        isRiskBadge ? "text-[13px]" : "text-[12px]",
        "px-3 h-[28px]",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
