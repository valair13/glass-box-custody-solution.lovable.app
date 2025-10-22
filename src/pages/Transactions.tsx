import { useState } from "react";
import { Download, ExternalLink, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  counterparty: string;
  status: "initiated" | "approvals" | "hsm-signed" | "broadcasted" | "confirmed" | "settled";
  eta: string;
  approver: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-2024-001",
    date: "2024-03-20 14:32",
    asset: "BTC",
    amount: "2.45",
    counterparty: "Coinbase Prime",
    status: "settled",
    eta: "Completed",
    approver: "Sarah Chen"
  },
  {
    id: "TXN-2024-002",
    date: "2024-03-20 13:18",
    asset: "ETH",
    amount: "125.00",
    counterparty: "Kraken Institutional",
    status: "confirmed",
    eta: "~5 min",
    approver: "Michael Torres"
  },
  {
    id: "TXN-2024-003",
    date: "2024-03-20 12:05",
    asset: "USDC",
    amount: "500,000",
    counterparty: "Circle",
    status: "broadcasted",
    eta: "~8 min",
    approver: "Jessica Park"
  },
  {
    id: "TXN-2024-004",
    date: "2024-03-20 11:42",
    asset: "SOL",
    amount: "1,200",
    counterparty: "FTX US (Legacy)",
    status: "hsm-signed",
    eta: "~12 min",
    approver: "David Kim"
  },
  {
    id: "TXN-2024-005",
    date: "2024-03-20 10:20",
    asset: "BTC",
    amount: "0.85",
    counterparty: "Gemini Trust",
    status: "approvals",
    eta: "~20 min",
    approver: "Pending: Alex Rivera"
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
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Transaction ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Asset</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Amount</th>
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
                  <td className="px-6 py-4 text-sm font-mono">{tx.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">{tx.asset}</td>
                  <td className="px-6 py-4 text-sm tabular-nums">{tx.amount}</td>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTx(tx)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
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
