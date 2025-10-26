import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, FileCheck, Clock, Settings, CheckCircle, AlertCircle } from "lucide-react";
import KPICard from "@/components/KPICard";

interface Role {
  id: string;
  role: string;
  user: string;
  permissions: {
    view: boolean;
    edit: boolean;
    approve: boolean;
  };
}

interface PolicyParam {
  name: string;
  value: string;
  lastUpdated: string;
  status: "active" | "pending";
}

interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

const roles: Role[] = [
  { id: "1", role: "Admin", user: "Sarah Chen", permissions: { view: true, edit: true, approve: true } },
  { id: "2", role: "Compliance", user: "Michael Torres", permissions: { view: true, edit: false, approve: true } },
  { id: "3", role: "Operator", user: "Alex Kim", permissions: { view: true, edit: true, approve: false } },
  { id: "4", role: "Auditor", user: "Emma Davis", permissions: { view: true, edit: false, approve: false } },
];

const policyParams: PolicyParam[] = [
  { name: "Daily Transfer Limit", value: "$10M", lastUpdated: "2024-01-15", status: "active" },
  { name: "Multi-signature Threshold", value: "3 of 5", lastUpdated: "2024-01-14", status: "active" },
  { name: "Whitelisted Wallets", value: "127 addresses", lastUpdated: "2024-01-16", status: "active" },
  { name: "Time Lock Duration", value: "24 hours", lastUpdated: "2024-01-12", status: "pending" },
];

const auditLog: AuditEntry[] = [
  { timestamp: "2024-01-16 14:32", action: "Policy Updated", user: "Sarah Chen", details: "Daily transfer limit increased" },
  { timestamp: "2024-01-16 11:15", action: "Transaction Approved", user: "Michael Torres", details: "BTC transfer to cold storage" },
  { timestamp: "2024-01-15 16:45", action: "User Role Modified", user: "Sarah Chen", details: "Added Alex Kim as Operator" },
  { timestamp: "2024-01-15 09:20", action: "Whitelist Updated", user: "Alex Kim", details: "Added 3 new wallet addresses" },
];

export default function InstitutionalControl() {
  return (
    <div className="space-y-8 p-8 bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading text-foreground">Institutional Control Layer</h1>
          <p className="text-muted-foreground mt-2">Role-based governance and policy management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
          <Button>
            <FileCheck className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Active Roles"
          value="4"
          subtitle="Across all levels"
          icon={Users}
          status="neutral"
        />
        <KPICard
          title="Policy Parameters"
          value="4"
          subtitle="1 pending update"
          icon={Shield}
          status="warning"
          trend="up"
          trendValue="+1"
        />
        <KPICard
          title="Pending Approvals"
          value="3"
          subtitle="Require review"
          icon={Clock}
          status="warning"
        />
        <KPICard
          title="Audit Events (24h)"
          value="24"
          subtitle="All tracked"
          icon={FileCheck}
          status="success"
        />
      </div>

      {/* Role-based Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Role-Based Hierarchy
          </CardTitle>
          <CardDescription>View and manage user permissions across institutional roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">View</TableHead>
                <TableHead className="text-center">Edit</TableHead>
                <TableHead className="text-center">Approve</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.role}</TableCell>
                  <TableCell>{role.user}</TableCell>
                  <TableCell className="text-center">
                    {role.permissions.view ? (
                      <CheckCircle className="h-4 w-4 text-success mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {role.permissions.edit ? (
                      <CheckCircle className="h-4 w-4 text-success mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {role.permissions.approve ? (
                      <CheckCircle className="h-4 w-4 text-success mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Control Board */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Policy Control Board
            </CardTitle>
            <CardDescription>Configure institutional custody parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {policyParams.map((param, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{param.name}</p>
                  <p className="text-muted-foreground text-xs">Updated {param.lastUpdated}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={param.status === "active" ? "default" : "secondary"}>
                    {param.status}
                  </Badge>
                  <p className="font-semibold text-foreground">{param.value}</p>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Audit Log Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Recent Audit Events
            </CardTitle>
            <CardDescription>System activity and governance actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditLog.map((entry, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {entry.action.includes("Approved") ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{entry.action}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{entry.details}</p>
                  <p className="text-xs text-foreground font-medium mt-1">by {entry.user}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Widget */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Pending Approvals
          </CardTitle>
          <CardDescription>Actions requiring compliance review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div>
                <p className="font-medium">Time Lock Duration Update</p>
                <p className="text-sm text-muted-foreground">Policy change requires 2 approvals</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div>
                <p className="font-medium">Whitelist Address Addition</p>
                <p className="text-sm text-muted-foreground">5 new addresses pending verification</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div>
                <p className="font-medium">Large Transfer Request</p>
                <p className="text-sm text-muted-foreground">$8.5M BTC transfer exceeds threshold</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
