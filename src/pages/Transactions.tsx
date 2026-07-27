import { useState } from "react";
import {
  Download,
  ExternalLink,
  Clock,
  Search,
  Copy,
  TrendingUp,
  Check,
  ChevronDown,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
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

type ConfidenceCheckState = "passed" | "pending" | "blocked";

interface ConfidenceCheck {
  label: string;
  state: ConfidenceCheckState;
  detail?: string;
}

interface Transaction {
  id: string;
  date: string;
  institution: string;
  settlementLayer: string;
  proofStatus: "verified" | "generating" | "delayed";
  compliance: "cleared" | "review" | "hold";
  confidence: number;
  confidenceState: "settled" | "confirmed" | "broadcasted" | "hsm-signed" | "approvals" | "initiated";
  statusLabel: string;
  reason: string;
  why: { headline: string; evidence: string[]; next: string };
  eta: string;
  approver: string;
  checks: ConfidenceCheck[];
  reference: string;
  value: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-2024-001",
    date: "2024-03-20 14:32",
    institution: "Northbridge Asset Management",
    settlementLayer: "zkSync Era → Ethereum",
    proofStatus: "verified",
    compliance: "cleared",
    confidence: 99,
    confidenceState: "settled",
    statusLabel: "Settled",
    reason: "Proof verified and finalized on Ethereum",
    why: {
      headline: "Settlement is final and independently verifiable",
      evidence: [
        "ZK validity proof verified on Ethereum L1",
        "Finality reached — 64 blocks past submission",
        "Internal ledger and custodian records matched",
      ],
      next: "No action required. Audit snapshot available.",
    },
    eta: "Completed",
    approver: "Sarah Chen",
    reference: "Treasury transfer • Ref TR-88213",
    value: "$142,350",
    checks: [
      { label: "ZK Proof generated", state: "passed", detail: "Batch #482,119" },
      { label: "Finalized on Ethereum", state: "passed", detail: "14:41 UTC" },
      { label: "Compliance policy matched", state: "passed", detail: "Policy 9.1 — Treasury transfer" },
      { label: "AML screening passed", state: "passed", detail: "No sanctions match" },
      { label: "Settlement confirmed", state: "passed", detail: "Ledger reconciled" },
    ],
  },
  {
    id: "TXN-2024-002",
    date: "2024-03-20 13:18",
    institution: "Kraken Institutional",
    settlementLayer: "zkSync Era → Ethereum",
    proofStatus: "verified",
    compliance: "cleared",
    confidence: 92,
    confidenceState: "confirmed",
    statusLabel: "Awaiting finality",
    reason: "Waiting for Ethereum finality",
    why: {
      headline: "Waiting for Ethereum finality",
      evidence: [
        "Validity proof submitted to L1 at 13:24 UTC",
        "22 of 64 confirmations observed",
        "Compliance and AML checks already cleared",
      ],
      next: "Estimated completion: 5 minutes.",
    },
    eta: "~5 min",
    approver: "Michael Torres",
    reference: "Client withdrawal • Ref CW-40218",
    value: "$456,250",
    checks: [
      { label: "ZK Proof generated", state: "passed", detail: "Batch #482,124" },
      { label: "Finalized on Ethereum", state: "pending", detail: "22 / 64 confirmations" },
      { label: "Compliance policy matched", state: "passed" },
      { label: "AML screening passed", state: "passed" },
      { label: "Settlement confirmed", state: "pending", detail: "Blocked on L1 finality" },
    ],
  },
  {
    id: "TXN-2024-003",
    date: "2024-03-20 12:05",
    institution: "Circle Treasury Services",
    settlementLayer: "zkSync Era",
    proofStatus: "generating",
    compliance: "cleared",
    confidence: 84,
    confidenceState: "broadcasted",
    statusLabel: "Proof pending",
    reason: "Proof generation queued behind large batch",
    why: {
      headline: "Proof generation delayed",
      evidence: [
        "Batch #482,131 is queued behind a high-volume batch",
        "No compliance or policy exceptions raised",
        "Funds remain under custody control until proof is verified",
      ],
      next: "Estimated completion: 11 minutes.",
    },
    eta: "~11 min",
    approver: "Jessica Park",
    reference: "Stablecoin settlement • Ref SS-11902",
    value: "$500,000",
    checks: [
      { label: "ZK Proof generated", state: "pending", detail: "Queued — batch #482,131" },
      { label: "Finalized on Ethereum", state: "pending" },
      { label: "Compliance policy matched", state: "passed" },
      { label: "AML screening passed", state: "passed" },
      { label: "Settlement confirmed", state: "pending" },
    ],
  },
  {
    id: "TXN-2024-004",
    date: "2024-03-20 11:42",
    institution: "Halcyon Pension Fund",
    settlementLayer: "zkSync Era → Ethereum",
    proofStatus: "verified",
    compliance: "hold",
    confidence: 61,
    confidenceState: "approvals",
    statusLabel: "Compliance hold",
    reason: "Transfer exceeds treasury policy threshold",
    why: {
      headline: "Transfer exceeds treasury policy threshold",
      evidence: [
        "Policy 14.2 — single transfer limit $100,000 for this mandate",
        "Requested amount is 1.27x the approved limit",
        "AML screening passed with no adverse findings",
      ],
      next: "Manual approval required from a Treasury Controller.",
    },
    eta: "Awaiting approval",
    approver: "Pending: David Kim",
    reference: "Mandate rebalance • Ref MR-77410",
    value: "$127,200",
    checks: [
      { label: "ZK Proof generated", state: "passed", detail: "Batch #482,108" },
      { label: "Finalized on Ethereum", state: "passed" },
      { label: "Compliance policy matched", state: "blocked", detail: "Policy 14.2 threshold exceeded" },
      { label: "AML screening passed", state: "passed" },
      { label: "Settlement confirmed", state: "pending", detail: "Held pending approval" },
    ],
  },
  {
    id: "TXN-2024-005",
    date: "2024-03-20 10:20",
    institution: "Gemini Trust Company",
    settlementLayer: "zkSync Era ↔ Ethereum",
    proofStatus: "delayed",
    compliance: "review",
    confidence: 72,
    confidenceState: "hsm-signed",
    statusLabel: "Under review",
    reason: "Cross-chain state mismatch under investigation",
    why: {
      headline: "Cross-chain state mismatch detected",
      evidence: [
        "L2 balance snapshot differs from custodian record by 0.85 units",
        "Automated re-verification running against the latest verified batch",
        "No funds have left custody control",
      ],
      next: "Estimated resolution: 20 minutes. Operations team notified.",
    },
    eta: "~20 min",
    approver: "Pending: Alex Rivera",
    reference: "Counterparty settlement • Ref CS-30554",
    value: "$49,385",
    checks: [
      { label: "ZK Proof generated", state: "pending", detail: "Re-verification in progress" },
      { label: "Finalized on Ethereum", state: "pending" },
      { label: "Compliance policy matched", state: "passed" },
      { label: "AML screening passed", state: "passed" },
      { label: "Settlement confirmed", state: "blocked", detail: "State mismatch under review" },
    ],
  },
];

const predictiveRisks = [
  {
    risk: "medium-risk" as const,
    level: "Medium",
    title: "Proof generation delayed for batch #482,131",
    tag: "Proof generation delayed",
    time: "5 min ago",
  },
  {
    risk: "medium-risk" as const,
    level: "Medium",
    title: "Ethereum finality running 12 blocks behind schedule",
    tag: "Waiting for Ethereum finality",
    time: "8 min ago",
  },
  {
    risk: "high-risk" as const,
    level: "High",
    title: "Custodian and L2 balances differ on 1 counterparty account",
    tag: "Cross-chain state mismatch",
    time: "12 min ago",
  },
  {
    risk: "high-risk" as const,
    level: "High",
    title: "Transfer above mandate limit awaiting controller decision",
    tag: "Compliance policy conflict",
    time: "18 min ago",
  },
  {
    risk: "medium-risk" as const,
    level: "Medium",
    title: "Two settlements awaiting final verification against ledger",
    tag: "Settlement verification pending",
    time: "26 min ago",
  },
  {
    risk: "medium-risk" as const,
    level: "Medium",
    title: "L1 confirmation window extended during peak gas period",
    tag: "L1 confirmation delayed",
    time: "34 min ago",
  },
];

const proofLabels: Record<Transaction["proofStatus"], { label: string; badge: string }> = {
  verified: { label: "Verified", badge: "low-risk" },
  generating: { label: "Generating", badge: "medium-risk" },
  delayed: { label: "Delayed", badge: "high-risk" },
};

const complianceLabels: Record<Transaction["compliance"], { label: string; badge: string }> = {
  cleared: { label: "Cleared", badge: "low-risk" },
  review: { label: "In review", badge: "medium-risk" },
  hold: { label: "Hold", badge: "high-risk" },
};

function CheckRow({ check }: { check: ConfidenceCheck }) {
  const marks = {
    passed: { symbol: <Check className="w-3.5 h-3.5" />, bg: "#E8F6EE", color: "#166534" },
    pending: { symbol: <Clock className="w-3.5 h-3.5" />, bg: "#F9EED2", color: "#946C1E" },
    blocked: { symbol: <HelpCircle className="w-3.5 h-3.5" />, bg: "#F8D9D9", color: "#A32323" },
  }[check.state];

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: marks.bg, color: marks.color }}
      >
        {marks.symbol}
      </span>
      <span className="text-[14px] text-[#0F172A]">{check.label}</span>
      {check.detail && <span className="text-[13px] text-[#64748B]">— {check.detail}</span>}
    </div>
  );
}

export default function Transactions() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layerFilter, setLayerFilter] = useState("all");
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Transaction Confidence Dashboard</h1>
          <p className="text-muted-foreground">
            Every transaction explained — why it can be trusted, approved and audited
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
              placeholder="Search institution, reference or transaction id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Confidence state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              <SelectItem value="settled">Settled</SelectItem>
              <SelectItem value="finality">Awaiting finality</SelectItem>
              <SelectItem value="proof">Proof pending</SelectItem>
              <SelectItem value="compliance">Compliance hold</SelectItem>
              <SelectItem value="review">Under review</SelectItem>
            </SelectContent>
          </Select>
          <Select value={layerFilter} onValueChange={setLayerFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Settlement layer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All settlement layers</SelectItem>
              <SelectItem value="zksync">zkSync Era</SelectItem>
              <SelectItem value="ethereum">Ethereum L1</SelectItem>
              <SelectItem value="custodian">Custodian ledger</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Predictive Risk & Anomalies */}
      <Card className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Predictive Risks (last 24h)</h2>
        <div className="divide-y divide-[#E2E8F0]">
          {predictiveRisks.map((r) => (
            <div key={r.title} className="flex items-center gap-4 h-[52px]">
              <StatusBadge status={r.risk} className="shrink-0">{r.level}</StatusBadge>
              <p className="text-[14px] font-medium text-[#0F172A] flex-1">{r.title}</p>
              <span className="inline-flex items-center justify-center rounded-full bg-[#E8EEFA] text-[#1E3A8A] font-medium text-[13px] px-[14px] h-[28px]">
                {r.tag}
              </span>
              <span className="text-[13px] text-[#64748B]">{r.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Mini KPIs */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Transaction Confidence"
          value="94%"
          subtitle="Weighted across open transactions"
          icon={ShieldCheck}
          status="success"
        />
        <KPICard
          title="Proofs Verified (24h)"
          value="99.1%"
          subtitle="Validity proofs accepted on L1"
          icon={TrendingUp}
          status="success"
        />
        <KPICard
          title="Explainable Decisions"
          value="100%"
          subtitle="Every state has a documented reason"
          icon={TrendingUp}
          status="success"
        />
        <KPICard
          title="Awaiting Human Decision"
          value="2"
          subtitle="Compliance holds and approvals"
          icon={Clock}
          status="warning"
        />
      </div>

      {/* Transactions Table */}
      <Card className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Institution</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Settlement Layer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Proof Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Compliance</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Confidence</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Reason</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">ETA</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Approver</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <>
                  <tr
                    key={tx.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-[#0F172A]">{tx.institution}</div>
                      <div className="text-[13px] text-[#64748B]">{tx.reference}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{tx.settlementLayer}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={proofLabels[tx.proofStatus].badge as any}>
                        {proofLabels[tx.proofStatus].label}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={complianceLabels[tx.compliance].badge as any}>
                        {complianceLabels[tx.compliance].label}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[90px]">
                          <div className="h-2 bg-[#DCE6FF] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#5671B0] to-[#2563EB] transition-all duration-500"
                              style={{ width: `${tx.confidence}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[13px] font-semibold text-[#111827] w-10 text-right">
                          {tx.confidence}%
                        </span>
                      </div>
                      <div className="text-[13px] text-[#64748B] mt-1">{tx.statusLabel}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#475569] max-w-[240px]">{tx.reason}</td>
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
                          variant="outline"
                          size="sm"
                          className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5"
                          onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                        >
                          Why?
                          <ChevronDown
                            className={`w-3.5 h-3.5 ml-1 transition-transform ${
                              expandedTx === tx.id ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
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
                  {expandedTx === tx.id && (
                    <tr key={`${tx.id}-why`} className="bg-muted/20 border-t border-border">
                      <td colSpan={9} className="px-6 py-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <div className="text-sm font-semibold mb-1">Why is it in this state?</div>
                            <p className="text-[15px] text-[#0F172A] mb-3">{tx.why.headline}</p>
                            <ul className="space-y-1.5 mb-3">
                              {tx.why.evidence.map((e) => (
                                <li key={e} className="text-[14px] text-[#475569]">• {e}</li>
                              ))}
                            </ul>
                            <p className="text-[14px] font-medium text-[#1E3A8A]">{tx.why.next}</p>
                          </div>
                          <div>
                            <div className="text-sm font-semibold mb-3">Confidence</div>
                            <div className="space-y-2.5">
                              {tx.checks.map((c) => (
                                <CheckRow key={c.label} check={c} />
                              ))}
                            </div>
                          </div>
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

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction Confidence</DialogTitle>
            <DialogDescription>
              {selectedTx?.id} • {selectedTx?.institution}
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-6 mt-4">
              {/* Confidence */}
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="text-sm font-semibold">Confidence</h3>
                  <span className="text-[13px] text-[#64748B]">
                    {selectedTx.confidence}% • {selectedTx.statusLabel}
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedTx.checks.map((c) => (
                    <CheckRow key={c.label} check={c} />
                  ))}
                </div>
              </div>

              {/* Why */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-2">Why?</h3>
                <p className="text-[15px] text-[#0F172A] mb-2">{selectedTx.why.headline}</p>
                <ul className="space-y-1.5 mb-2">
                  {selectedTx.why.evidence.map((e) => (
                    <li key={e} className="text-[14px] text-[#475569]">• {e}</li>
                  ))}
                </ul>
                <p className="text-[14px] font-medium text-[#1E3A8A]">{selectedTx.why.next}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Institution</div>
                  <div className="font-medium">{selectedTx.institution}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Settlement layer</div>
                  <div className="font-medium">{selectedTx.settlementLayer}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Responsible approver</div>
                  <div className="font-medium">{selectedTx.approver}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated completion</div>
                  <div className="font-medium">{selectedTx.eta}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Business reference</div>
                  <div className="font-medium">{selectedTx.reference}</div>
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
                  Share Explanation with Auditor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
