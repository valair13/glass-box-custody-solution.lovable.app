import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Shield,
  Network,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/dashboard/summary", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/transactions", icon: Activity, label: "Transactions" },
  { to: "/dashboard/compliance", icon: Shield, label: "Compliance" },
  { to: "/dashboard/reconciliation", icon: Network, label: "Reconciliation" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Anchorage Digital
          </h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">
            Institutional Custody
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
