import { TrendingUp, DollarSign, Clock, CheckCircle, Network, RefreshCw } from "lucide-react";
import KPICard from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Summary() {
  const [timeRange, setTimeRange] = useState("30d");

  const transparencyData30d = [
    { date: "Jan 1", score: 92 },
    { date: "Jan 5", score: 93 },
    { date: "Jan 10", score: 94 },
    { date: "Jan 15", score: 95 },
    { date: "Jan 20", score: 96 },
    { date: "Jan 25", score: 97 },
    { date: "Jan 30", score: 94 },
  ];

  const transparencyData7d = [
    { date: "Mon", score: 93 },
    { date: "Tue", score: 94 },
    { date: "Wed", score: 95 },
    { date: "Thu", score: 94 },
    { date: "Fri", score: 96 },
    { date: "Sat", score: 95 },
    { date: "Sun", score: 94 },
  ];

  const transparencyData90d = [
    { date: "Oct", score: 88 },
    { date: "Nov", score: 90 },
    { date: "Dec", score: 92 },
    { date: "Jan", score: 94 },
  ];

  const getTransparencyData = () => {
    switch (timeRange) {
      case "7d":
        return transparencyData7d;
      case "90d":
        return transparencyData90d;
      default:
        return transparencyData30d;
    }
  };

  const currentScore = 94;

  const assetAllocationData = [
    { asset: "Bitcoin", value: 980, percentage: 41, color: "#F7931A" },
    { asset: "Ethereum", value: 720, percentage: 30, color: "#627EEA" },
    { asset: "USDC", value: 480, percentage: 20, color: "#2775CA" },
    { asset: "Others", value: 220, percentage: 9, color: "#94A3B8" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Transparency Summary</h1>
          <p className="text-muted-foreground">
            Executive overview of custody operations and trust metrics
          </p>
        </div>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Generate Monthly Report
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Transparency Score"
          value="97%"
          subtitle="Trust metric across all operations"
          icon={TrendingUp}
          trend="up"
          trendValue="+2% from last month"
          status="success"
        />
        <KPICard
          title="Total Assets Under Management"
          value="$2.4B"
          subtitle="Across all chains and assets"
          icon={DollarSign}
          status="neutral"
        />
        <KPICard
          title="Pending Reviews"
          value="12"
          subtitle="$8.5M total value"
          icon={Clock}
          status="warning"
        />
        <KPICard
          title="Average Approval Time"
          value="4.2h"
          subtitle="Down from 6.1h last week"
          icon={CheckCircle}
          trend="down"
          trendValue="-31% improvement"
          status="success"
        />
        <KPICard
          title="Cross-chain Reconciliation"
          value="97%"
          subtitle="4 pending • 1 under review"
          icon={Network}
          status="success"
        />
        <KPICard
          title="Last ERP Sync"
          value="2 min"
          subtitle="Synced at 14:32 UTC"
          icon={RefreshCw}
          status="success"
        />
      </div>

      {/* Transparency Trend Chart */}
      <Card className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Transparency Score Trend</h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTransparencyData()}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  domain={[85, 100]} 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#1E3A8A" 
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[44px] font-semibold text-success tabular-nums">
              {currentScore}%
            </div>
            <div className="text-sm text-muted-foreground">Current</div>
          </div>
        </div>
      </Card>

      {/* Operational Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <div className="flex items-center gap-8">
            <div className="flex-1 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="percentage"
                  >
                    {assetAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${props.payload.percentage}% ($${props.payload.value}M)`,
                      props.payload.asset
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {assetAllocationData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.asset}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.percentage}% • ${item.value}M
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { time: "14:45", action: "Transaction settled", status: "success" },
              { time: "14:32", action: "ERP sync completed", status: "success" },
              { time: "13:18", action: "Compliance check cleared", status: "success" },
              { time: "12:55", action: "New transaction initiated", status: "pending" },
              { time: "11:30", action: "Reconciliation completed", status: "success" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === "success" ? "bg-success" : "bg-warning"
                }`} />
                <span className="text-sm text-muted-foreground">{item.time}</span>
                <span className="text-sm flex-1">{item.action}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
