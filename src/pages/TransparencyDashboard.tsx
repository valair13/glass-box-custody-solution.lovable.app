import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, TrendingUp, Activity, Clock, FileText, Download, Copy, ExternalLink } from "lucide-react";
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
  id: string;
  date: string;
  asset: string;
  amount: string;
  usdValue: string;
  counterparty: string;
  status: "initiated" | "approvals" | "hsm-signed" | "broadcasted" | "confirmed" | "settled";
  eta: string;
  approver: string;
}

const recentActivities: Activity[] = [
  { id: "TXN-2024-101", date: "2024-01-16 14:32", asset: "BTC", amount: "2.45", usdValue: "$142,350", counterparty: "Coinbase Prime", status: "settled", eta: "Completed", approver: "Sarah Chen" },
  { id: "TXN-2024-102", date: "2024-01-16 13:18", asset: "ETH", amount: "125.00", usdValue: "$456,250", counterparty: "Kraken Institutional", status: "confirmed", eta: "~5 min", approver: "Michael Torres" },
  { id: "TXN-2024-103", date: "2024-01-16 12:05", asset: "USDC", amount: "500,000", usdValue: "$500,000", counterparty: "Circle", status: "broadcasted", eta: "~8 min", approver: "Jessica Park" },
  { id: "TXN-2024-104", date: "2024-01-15 16:45", asset: "SOL", amount: "1,200", usdValue: "$127,200", counterparty: "FTX US (Legacy)", status: "hsm-signed", eta: "~12 min", approver: "David Kim" },
  { id: "TXN-2024-105", date: "2024-01-15 14:20", asset: "BTC", amount: "0.85", usdValue: "$49,385", counterparty: "Gemini Trust", status: "approvals", eta: "~20 min", approver: "Alex Rivera" },
  { id: "TXN-2024-106", date: "2024-01-15 09:30", asset: "ETH", amount: "50.00", usdValue: "$182,500", counterparty: "Coinbase", status: "initiated", eta: "~25 min", approver: "Emma Davis" },
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
                <TableHead>Asset</TableHead>
                <TableHead>Amount (Crypto)</TableHead>
                <TableHead>USD Value</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{activity.date}</TableCell>
                  <TableCell className="font-medium">{activity.asset}</TableCell>
                  <TableCell className="tabular-nums">{activity.amount}</TableCell>
                  <TableCell className="font-medium">{activity.usdValue}</TableCell>
                  <TableCell>{activity.counterparty}</TableCell>
                  <TableCell>
                    <StatusBadge status={activity.status}>
                      {activity.status === "initiated" ? "Initiated" :
                       activity.status === "approvals" ? "Approval" :
                       activity.status === "hsm-signed" ? "HSM" :
                       activity.status === "broadcasted" ? "Broadcast" :
                       activity.status === "confirmed" ? "Confirmed" : "Settled"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{activity.eta}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.approver}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(activity.id)}
                        title="Copy Transaction ID"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
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
