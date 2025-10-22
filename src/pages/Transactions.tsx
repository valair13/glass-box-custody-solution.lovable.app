import { useState } from "react";
import { Download, ExternalLink, Clock, Search, Copy, TrendingUp } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KPICard from "@/components/KPICard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  date: string;
  asset: string;
  amount: string;
  usdValue: string;
  counterparty: string;
  status: "initiated" | "approvals" | "hsm-signed" | "broadcasted" | "confirmed" | "settled";
  eta: string;
  approver: string;
  chain: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-2024-001",
    date: "2024-03-20 14:32",
    asset: "BTC",
    amount: "2.45",
    usdValue: "$142,350",
    counterparty: "Coinbase Prime",
    status: "settled",
    eta: "Completed",
    approver: "Sarah Chen",
    chain: "Bitcoin"
  },
  {
    id: "TXN-2024-002",
    date: "2024-03-20 13:18",
    asset: "ETH",
    amount: "125.00",
    usdValue: "$456,250",
    counterparty: "Kraken Institutional",
    status: "confirmed",
    eta: "~5 min",
    approver: "Michael Torres",
    chain: "Ethereum"
  },
  {
    id: "TXN-2024-003",
    date: "2024-03-20 12:05",
    asset: "USDC",
    amount: "500,000",
    usdValue: "$500,000",
    counterparty: "Circle",
    status: "broadcasted",
    eta: "~8 min",
    approver: "Jessica Park",
    chain: "Ethereum"
  },
  {
    id: "TXN-2024-004",
    date: "2024-03-20 11:42",
    asset: "SOL",
    amount: "1,200",
    usdValue: "$127,200",
    counterparty: "FTX US (Legacy)",
    status: "hsm-signed",
    eta: "~12 min",
    approver: "David Kim",
    chain: "Solana"
  },
  {
    id: "TXN-2024-005",
    date: "2024-03-20 10:20",
    asset: "BTC",
    amount: "0.85",
    usdValue: "$49,385",
    counterparty: "Gemini Trust",
    status: "approvals",
    eta: "~20 min",
    approver: "Pending: Alex Rivera",
    chain: "Bitcoin"
  },
];

const statusSteps = [
  { key: "initiated", label: "Initiated", description: "Transaction created and queued for approval" },
  { key: "approvals", label: "Approvals", description: "Awaiting multi-signature approval from authorized parties" },
  { key: "hsm-signed", label: "HSM-Signed", description: "Securely signed by Hardware Security Module" },
  { key: "broadcasted", label: "Broadcasted", description: "Sent to blockchain network, awaiting confirmations" },
  { key: "confirmed", label: "Confirmed", description: "Network confirmed, awaiting final settlement" },
  { key: "settled", label: "Settled", description: "Transaction finalized and reconciled" },
];

export default function Transactions() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chainFilter, setChainFilter] = useState("all");

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(s => s.key === status);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Transaction Status Timeline</h1>
          <p className="text-muted-foreground">
            Complete lifecycle tracking with explainability and confidence
          </p>
        </div>
        <Button variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-panel rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search address, tx id, or counterparty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="initiated">Initiated</SelectItem>
              <SelectItem value="approvals">Approvals</SelectItem>
              <SelectItem value="hsm-signed">HSM-Signed</SelectItem>
              <SelectItem value="broadcasted">Broadcasted</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="settled">Settled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chainFilter} onValueChange={setChainFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chain/Asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              <SelectItem value="Bitcoin">Bitcoin</SelectItem>
              <SelectItem value="Ethereum">Ethereum</SelectItem>
              <SelectItem value="Solana">Solana</SelectItem>
              <SelectItem value="Polygon">Polygon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Predictive Risk & Anomalies */}
      <Card className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Predictive Risk & Anomalies (last 24h)</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <StatusBadge status="medium" className="shrink-0">MEDIUM</StatusBadge>
            <p className="text-sm text-muted-foreground">
              Ethereum: finality delayed by 12 blocks — 09:20 UTC
            </p>
          </div>
          <div className="flex items-start gap-3">
            <StatusBadge status="medium" className="shrink-0">MEDIUM</StatusBadge>
            <p className="text-sm text-muted-foreground">
              Transaction amount 3.2× above 30d average — 09:16 UTC
            </p>
          </div>
          <div className="flex items-start gap-3">
            <StatusBadge status="low" className="shrink-0">LOW</StatusBadge>
            <p className="text-sm text-muted-foreground">
              System normal — 09:10 UTC
            </p>
          </div>
        </div>
      </Card>

      {/* Mini KPIs */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Settlement Efficiency Rate"
          value="98.4%"
          icon={TrendingUp}
          status="success"
        />
        <KPICard
          title="Reconciliation Accuracy"
          value="97.4%"
          icon={TrendingUp}
          status="success"
        />
        <KPICard
          title="AUM under Custody"
          value="$24.0B"
          icon={TrendingUp}
          status="neutral"
        />
        <KPICard
          title="Security Confidence"
          value="92%"
          icon={TrendingUp}
          status="success"
        />
      </div>

      {/* Transactions Table */}
      <Card className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Asset</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Amount (Crypto)</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">USD Value</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Counterparty</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">ETA</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Approver</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-medium">{tx.asset}</td>
                  <td className="px-6 py-4 text-sm tabular-nums">{tx.amount}</td>
                  <td className="px-6 py-4 text-sm font-medium">{tx.usdValue}</td>
                  <td className="px-6 py-4 text-sm">{tx.counterparty}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status}>
                      {statusSteps.find(s => s.key === tx.status)?.label}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {tx.eta}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{tx.approver}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(tx.id)}
                        title="Copy Transaction ID"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTx(tx)}
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {selectedTx?.id} • {selectedTx?.asset} {selectedTx?.amount}
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-6 mt-4">
              {/* Progress Timeline */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Transaction Progress</h3>
                <div className="relative">
                  {statusSteps.map((step, i) => {
                    const currentIndex = getStatusIndex(selectedTx.status);
                    const isComplete = i <= currentIndex;
                    const isCurrent = i === currentIndex;

                    return (
                      <div key={step.key} className="flex gap-4 pb-8 last:pb-0 relative">
                        {i < statusSteps.length - 1 && (
                          <div
                            className={`absolute left-[15px] top-[30px] w-0.5 h-full ${
                              isComplete ? "bg-success" : "bg-border"
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isComplete
                              ? "bg-success border-success"
                              : "bg-background border-border"
                          } ${isCurrent && "glow-accent"}`}
                        >
                          {isComplete && (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${isCurrent && "text-primary"}`}>
                            {step.label}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </div>
                          {isCurrent && (
                            <StatusBadge status={selectedTx.status} className="mt-2">
                              In Progress
                            </StatusBadge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Counterparty</div>
                  <div className="font-medium">{selectedTx.counterparty}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Responsible Approver</div>
                  <div className="font-medium">{selectedTx.approver}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated Time</div>
                  <div className="font-medium">{selectedTx.eta}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Initiated</div>
                  <div className="font-medium">{selectedTx.date}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Audit Snapshot
                </Button>
                <Button variant="outline" className="flex-1">
                  View on Explorer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
