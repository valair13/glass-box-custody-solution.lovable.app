import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon | ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  status?: "success" | "warning" | "error" | "neutral";
  className?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  status = "neutral",
  className,
}: KPICardProps) {
  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    error: "text-destructive",
    neutral: "text-foreground",
  };

  const iconColor = "#5671B0"; // Soft Blue for all icons

  return (
    <div className={cn("glass-panel-hover rounded-2xl p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        {Icon && typeof Icon === 'function' ? (
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        ) : Icon ? (
          <>{Icon}</>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className={cn("text-kpi", statusColors[status])}>
          {value}
        </div>

        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}

        {trend && trendValue && (
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "stable" && "text-muted-foreground"
            )}>
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "stable" && "→"}
            </span>
            <span className="text-muted-foreground">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
