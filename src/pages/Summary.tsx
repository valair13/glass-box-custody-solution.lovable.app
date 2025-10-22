import { TrendingUp, DollarSign, Clock, CheckCircle, Network, RefreshCw } from "lucide-react";
import KPICard from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Summary() {
  const transparencyData = [
    { month: "Oct", score: 92 },
    { month: "Nov", score: 94 },
    { month: "Dec", score: 95 },
    { month: "Jan", score: 96 },
    { month: "Feb", score: 97 },
    { month: "Mar", score: 97 },
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
          subtitle="2% pending, 1% under review"
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
        <h2 className="text-xl font-semibold mb-6">Transparency Score Trend</h2>
        <div className="h-64 flex items-end justify-around gap-4">
          {transparencyData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
              <div className="text-sm font-medium text-success">
                {data.score}%
              </div>
              <div
                className="w-full bg-gradient-to-t from-success to-success/30 rounded-t-lg transition-all duration-500"
                style={{ height: `${data.score}%` }}
              />
              <div className="text-sm text-muted-foreground">{data.month}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Operational Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <div className="space-y-4">
            {[
              { asset: "Bitcoin", value: "$980M", percentage: 41, color: "bg-orange-500" },
              { asset: "Ethereum", value: "$720M", percentage: 30, color: "bg-blue-500" },
              { asset: "USDC", value: "$480M", percentage: 20, color: "bg-green-500" },
              { asset: "Others", value: "$220M", percentage: 9, color: "bg-gray-400" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.asset}</span>
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
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
