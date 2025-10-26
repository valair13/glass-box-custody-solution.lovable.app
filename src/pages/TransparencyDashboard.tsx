import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, TrendingUp, Activity, Clock, FileText, Download } from "lucide-react";
import KPICard from "@/components/KPICard";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import StatusBadge from "@/components/StatusBadge";

const complianceTrendData = [
  { month: "Jul", automated: 85, manual: 15 },
  { month: "Aug", automated: 88, manual: 12 },
  { month: "Sep", automated: 91, manual: 9 },
  { month: "Oct", automated: 93, manual: 7 },
  { month: "Nov", automated: 95, manual: 5 },
  { month: "Dec", automated: 97, manual: 3 },
];

const anomalyData = [
  { name: "Resolved", value: 234, color: "hsl(var(--success))" },
  { name: "Active", value: 12, color: "hsl(var(--warning))" },
];

interface Activity {
  date: string;
  network: string;
  type: string;
  status: "confirmed" | "pending" | "blocked";
  reviewer: string;
}

const recentActivities: Activity[] = [
  { date: "2024-01-16", network: "Ethereum", type: "Withdrawal", status: "confirmed", reviewer: "M. Torres" },
  { date: "2024-01-16", network: "Bitcoin", type: "Deposit", status: "confirmed", reviewer: "S. Chen" },
  { date: "2024-01-16", network: "Polygon", type: "Transfer", status: "pending", reviewer: "—" },
  { date: "2024-01-15", network: "Solana", type: "Withdrawal", status: "confirmed", reviewer: "E. Davis" },
  { date: "2024-01-15", network: "Ethereum", type: "Swap", status: "confirmed", reviewer: "M. Torres" },
  { date: "2024-01-15", network: "Bitcoin", type: "Transfer", status: "blocked", reviewer: "S. Chen" },
];

export default function TransparencyDashboard() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="space-y-8 p-8 bg-background">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading text-foreground">Transparency Dashboard</h1>
          <p className="text-muted-foreground mt-2">System-wide visibility and trust metrics</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Custody Health Score"
          value="94"
          subtitle="System Trust Index"
          icon={Shield}
          status="success"
          trend="up"
          trendValue="+2"
        />
        <KPICard
          title="Resolved Anomalies"
          value="234"
          subtitle="vs 12 active"
          icon={Activity}
          status="success"
          trend="up"
          trendValue="+18"
        />
        <KPICard
          title="Avg Approval Time"
          value="2.4h"
          subtitle="24h average"
          icon={Clock}
          status="success"
          trend="down"
          trendValue="-0.3h"
        />
        <KPICard
          title="Compliance Rate"
          value="97%"
          subtitle="Automated checks"
          icon={TrendingUp}
          status="success"
          trend="up"
          trendValue="+2%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Consistency Trendline */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Compliance Consistency Trend
            </CardTitle>
            <CardDescription>Automated vs manual approvals over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={complianceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="automated"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))" }}
                  name="Automated %"
                />
                <Line
                  type="monotone"
                  dataKey="manual"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--warning))" }}
                  name="Manual %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolved vs Active Anomalies */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Anomaly Resolution Status
            </CardTitle>
            <CardDescription>System-wide anomaly tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={anomalyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {anomalyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 mt-4">
              {anomalyData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Transaction Activity
          </CardTitle>
          <CardDescription>Latest custody operations and approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{activity.date}</TableCell>
                  <TableCell>{activity.network}</TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>
                    <StatusBadge status={activity.status}>
                      {activity.status === "confirmed" ? "Approved" : activity.status === "blocked" ? "Rejected" : "Pending"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{activity.reviewer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Trust Summary */}
      <Card className="border-success/50 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success" />
            System Trust Summary
          </CardTitle>
          <CardDescription>Overall institutional custody performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Transparency Score</p>
              <p className="text-kpi text-success">94/100</p>
              <p className="text-xs text-muted-foreground">Excellent governance visibility</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <p className="text-kpi text-success">95.1%</p>
              <p className="text-xs text-muted-foreground">Anomalies handled within SLA</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-kpi text-success">99.98%</p>
              <p className="text-xs text-muted-foreground">30-day system availability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
