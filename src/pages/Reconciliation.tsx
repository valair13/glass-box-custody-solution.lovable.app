import { Download, FileText, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ChainData {
  chain: string;
  asset: string;
  confirmed: string;
  pending: string;
  underReview: string;
  lastVerified: string;
  risk: "low" | "medium" | "high";
  reconciliation: number;
  networkNote?: string;
}

const chainData: ChainData[] = [
  {
    chain: "Ethereum",
    asset: "ETH, USDC, USDT",
    confirmed: "$720M",
    pending: "$12M",
    underReview: "$0",
    lastVerified: "2 min ago",
    risk: "low",
    reconciliation: 98,
  },
  {
    chain: "Bitcoin",
    asset: "BTC",
    confirmed: "$980M",
    pending: "$8M",
    underReview: "$0",
    lastVerified: "5 min ago",
    risk: "low",
    reconciliation: 99,
  },
  {
    chain: "Solana",
    asset: "SOL, USDC",
    confirmed: "$145M",
    pending: "$18M",
    underReview: "$5M",
    lastVerified: "8 min ago",
    risk: "medium",
    reconciliation: 86,
    networkNote: "2 delayed confirmations — network congestion",
  },
  {
    chain: "Polygon",
    asset: "MATIC, USDC",
    confirmed: "$92M",
    pending: "$3M",
    underReview: "$0",
    lastVerified: "3 min ago",
    risk: "low",
    reconciliation: 97,
  },
  {
    chain: "Avalanche",
    asset: "AVAX, USDC",
    confirmed: "$68M",
    pending: "$2M",
    underReview: "$0",
    lastVerified: "4 min ago",
    risk: "low",
    reconciliation: 97,
  },
];

export default function Reconciliation() {
  const totalConfirmed = chainData.reduce((acc, c) => acc + c.reconciliation, 0) / chainData.length;
  const totalPending = chainData.filter(c => parseFloat(c.pending.replace(/[$M]/g, '')) > 0).length;
  const totalUnderReview = chainData.filter(c => parseFloat(c.underReview.replace(/[$M]/g, '')) > 0).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Cross-chain Reconciliation Hub</h1>
          <p className="text-muted-foreground">
            Multi-chain asset reporting and compliance status in one audit-friendly view
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Export to ERP
          </Button>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <FileText className="w-4 h-4 mr-2" />
            Generate Audit Snapshot
          </Button>
        </div>
      </div>

      {/* Summary Widget */}
      <Card className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Reconciliation Summary</h2>
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-2">Overall Progress</div>
            <div className="text-3xl font-semibold text-success mb-3">
              {Math.round(totalConfirmed)}% Confirmed
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-success"
                  style={{ width: `${totalConfirmed}%` }}
                />
                <div
                  className="bg-warning"
                  style={{ width: `${(100 - totalConfirmed) * 0.7}%` }}
                />
                <div
                  className="bg-destructive"
                  style={{ width: `${(100 - totalConfirmed) * 0.3}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Confirmed</div>
              <div className="text-2xl font-semibold text-success">
                {Math.round(totalConfirmed)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Pending</div>
              <div className="text-2xl font-semibold text-warning">
                {totalPending} chains
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Under Review</div>
              <div className="text-2xl font-semibold text-destructive">
                {totalUnderReview} chains
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chain Reconciliation Table */}
      <Card className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Chain</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Assets</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Confirmed</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Pending</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Under Review</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Last Verified</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Risk</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Reconciliation</th>
              </tr>
            </thead>
            <tbody>
              {chainData.map((chain, i) => (
                <>
                  <tr
                    key={chain.chain}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{chain.chain}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{chain.asset}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-success">{chain.confirmed}</td>
                    <td className="px-6 py-4 text-sm text-warning">{chain.pending}</td>
                    <td className="px-6 py-4 text-sm text-destructive">{chain.underReview}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{chain.lastVerified}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={chain.risk}>
                        {chain.risk.toUpperCase()}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                chain.reconciliation >= 95
                                  ? "bg-success"
                                  : chain.reconciliation >= 85
                                  ? "bg-warning"
                                  : "bg-destructive"
                              }`}
                              style={{ width: `${chain.reconciliation}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {chain.reconciliation}%
                        </span>
                      </div>
                    </td>
                  </tr>
                  {chain.networkNote && (
                    <tr className="border-t border-border bg-warning/5">
                      <td colSpan={8} className="px-6 py-3">
                        <div className="flex items-center gap-2 text-sm text-warning-foreground">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">Anomaly Detected:</span>
                          <span>{chain.networkNote}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Chain Heatmap Visualization */}
      <Card className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-6">Chain Health Heatmap</h2>
        <div className="grid grid-cols-5 gap-4">
          {chainData.map((chain) => (
            <div
              key={chain.chain}
              className={`rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                chain.reconciliation >= 95
                  ? "bg-success/10 border-2 border-success/20"
                  : chain.reconciliation >= 85
                  ? "bg-warning/10 border-2 border-warning/20"
                  : "bg-destructive/10 border-2 border-destructive/20"
              }`}
            >
              <div className="text-sm font-medium mb-2">{chain.chain}</div>
              <div className="text-2xl font-bold mb-1">{chain.reconciliation}%</div>
              <div className="text-xs text-muted-foreground">{chain.lastVerified}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
