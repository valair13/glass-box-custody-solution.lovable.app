import { Fragment, useState } from "react";
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
  FileText,
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

interface EvidenceItem {
  label: string;
  value: string;
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
  blocker: string;
  requiredApprover: string;
  actions: string[];
  primaryAction: string;
  evidencePack: EvidenceItem[];
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
    settlementLayer: "Institutional settlement network",
    proofStatus: "verified",
    compliance: "cleared",
    confidence: 99,
    confidenceState: "settled",
    statusLabel: "Settled",
    reason: "Settlement cryptographically verified and final",
    why: {
      headline: "Settlement is final and independently verifiable",
      evidence: [
        "Settlement cryptographically verified against the settlement network",
        "Final confirmation reached — no reversal possible",
        "Internal ledger and custodian records matched",
      ],
      next: "No action required. Audit evidence package is complete.",
    },
    blocker: "None — settlement complete",
    requiredApprover: "Not required",
    actions: ["Export audit evidence", "Share explanation with auditor", "Notify counterparty"],
    primaryAction: "Export audit evidence",
    evidencePack: [
      { label: "Verification timestamp", value: "20 Mar 2024, 14:41 UTC" },
      { label: "Settlement certificate", value: "SC-482119-NB • available" },
      { label: "Settlement reference", value: "0x8f2a…c471" },
      { label: "Compliance decision", value: "Cleared under Policy 9.1" },
      { label: "Ledger comparison", value: "Matched — 0 variance" },
      { label: "Audit trail", value: "12 events recorded" },
    ],
    eta: "Completed",
    approver: "Sarah Chen",
    reference: "Treasury transfer • Ref TR-88213",
    value: "$142,350",
    checks: [
      { label: "Settlement cryptographically verified", state: "passed", detail: "Verified 14:38 UTC" },
      { label: "Final confirmation reached", state: "passed", detail: "14:41 UTC" },
      { label: "Compliance policy satisfied", state: "passed", detail: "Policy 9.1 — Treasury transfer" },
      { label: "Sanctions and AML screening passed", state: "passed", detail: "No adverse findings" },
      { label: "Treasury ledger matched", state: "passed", detail: "0 variance" },
      { label: "Audit evidence available", state: "passed", detail: "Export ready" },
    ],
  },
  {
    id: "TXN-2024-002",
    date: "2024-03-20 13:18",
    institution: "Kraken Institutional",
    settlementLayer: "Institutional settlement network",
    proofStatus: "verified",
    compliance: "cleared",
    confidence: 92,
    confidenceState: "confirmed",
    statusLabel: "Awaiting final confirmation",
    reason: "Settlement awaiting final confirmation",
    why: {
      headline: "Settlement verified — awaiting final confirmation",
      evidence: [
        "Settlement cryptographically verified at 13:24 UTC",
        "Final confirmation 22 of 64 steps complete",
        "Compliance and sanctions screening already cleared",
      ],
      next: "No action needed. Completion expected within 5 minutes.",
    },
    blocker: "Waiting on network final confirmation window",
    requiredApprover: "Not required",
    actions: ["Re-run verification", "Notify counterparty", "Export interim evidence"],
    primaryAction: "Notify counterparty",
    evidencePack: [
      { label: "Verification timestamp", value: "20 Mar 2024, 13:24 UTC" },
      { label: "Settlement certificate", value: "Issued on final confirmation" },
      { label: "Settlement reference", value: "0x41be…9d02" },
      { label: "Compliance decision", value: "Cleared under Policy 9.4" },
      { label: "Ledger comparison", value: "Matched — pending final post" },
      { label: "Audit trail", value: "9 events recorded" },
    ],
    eta: "~5 min",
    approver: "Michael Torres",
    reference: "Client withdrawal • Ref CW-40218",
    value: "$456,250",
    checks: [
      { label: "Settlement cryptographically verified", state: "passed", detail: "13:24 UTC" },
      { label: "Final confirmation reached", state: "pending", detail: "22 of 64 steps" },
      { label: "Compliance policy satisfied", state: "passed" },
      { label: "Sanctions and AML screening passed", state: "passed" },
      { label: "Treasury ledger matched", state: "pending", detail: "Posts on confirmation" },
      { label: "Audit evidence available", state: "pending", detail: "Partial" },
    ],
  },
  {
    id: "TXN-2024-003",
    date: "2024-03-20 12:05",
    institution: "Circle Treasury Services",
    settlementLayer: "Institutional settlement network",
    proofStatus: "generating",
    compliance: "cleared",
    confidence: 84,
    confidenceState: "broadcasted",
    statusLabel: "Verification in progress",
    reason: "Verification queued behind a high-volume settlement batch",
    why: {
      headline: "Settlement verification is queued",
      evidence: [
        "Verification queued behind a high-volume settlement batch",
        "No compliance or policy exceptions raised",
        "Funds remain under custody control until verification completes",
      ],
      next: "Monitor. Expected to clear in 11 minutes without intervention.",
    },
    blocker: "Verification capacity queue",
    requiredApprover: "Not required",
    actions: ["Request priority verification", "Re-run verification", "Notify counterparty"],
    primaryAction: "Request priority verification",
    evidencePack: [
      { label: "Verification timestamp", value: "Pending — queued 12:09 UTC" },
      { label: "Settlement certificate", value: "Not yet issued" },
      { label: "Settlement reference", value: "Assigned on verification" },
      { label: "Compliance decision", value: "Cleared under Policy 7.2" },
      { label: "Ledger comparison", value: "Matched — provisional" },
      { label: "Audit trail", value: "6 events recorded" },
    ],
    eta: "~11 min",
    approver: "Jessica Park",
    reference: "Stablecoin settlement • Ref SS-11902",
    value: "$500,000",
    checks: [
      { label: "Settlement cryptographically verified", state: "pending", detail: "Queued" },
      { label: "Final confirmation reached", state: "pending" },
      { label: "Compliance policy satisfied", state: "passed" },
      { label: "Sanctions and AML screening passed", state: "passed" },
      { label: "Treasury ledger matched", state: "pending" },
      { label: "Audit evidence available", state: "pending" },
    ],
  },
  {
    id: "TXN-2024-004",
    date: "2024-03-20 11:42",
    institution: "Halcyon Pension Fund",
    settlementLayer: "Institutional settlement network",
    proofStatus: "verified",
    compliance: "hold",
    confidence: 61,
    confidenceState: "approvals",
    statusLabel: "Compliance hold",
    reason: "Transfer exceeds Treasury Policy 14.2",
    why: {
      headline: "Transfer exceeds Treasury Policy 14.2",
      evidence: [
        "Policy 14.2 — single transfer limit $100,000 for this mandate",
        "Requested amount is 1.27x the approved limit",
        "Sanctions and AML screening passed with no adverse findings",
      ],
      next: "Approve, escalate or request additional verification.",
    },
    blocker: "Manual approval required",
    requiredApprover: "Chief Financial Officer",
    actions: ["Approve", "Escalate", "Request additional verification", "Export audit evidence"],
    primaryAction: "Approve",
    evidencePack: [
      { label: "Verification timestamp", value: "20 Mar 2024, 11:48 UTC" },
      { label: "Settlement certificate", value: "Held pending approval" },
      { label: "Settlement reference", value: "0xa9c1…7f38" },
      { label: "Compliance decision", value: "Hold — Policy 14.2 breach" },
      { label: "Ledger comparison", value: "Matched — 0 variance" },
      { label: "Audit trail", value: "11 events recorded" },
    ],
    eta: "~10 min once approved",
    approver: "Pending: David Kim",
    reference: "Mandate rebalance • Ref MR-77410",
    value: "$127,200",
    checks: [
      { label: "Settlement cryptographically verified", state: "passed", detail: "11:48 UTC" },
      { label: "Final confirmation reached", state: "passed" },
      { label: "Compliance policy satisfied", state: "blocked", detail: "Policy 14.2 threshold exceeded" },
      { label: "Sanctions and AML screening passed", state: "passed" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Audit evidence available", state: "passed" },
    ],
  },
  {
    id: "TXN-2024-005",
    date: "2024-03-20 10:20",
    institution: "Gemini Trust Company",
    settlementLayer: "Institutional settlement network",
    proofStatus: "delayed",
    compliance: "review",
    confidence: 72,
    confidenceState: "hsm-signed",
    statusLabel: "Records require reconciliation",
    reason: "Settlement records require reconciliation",
    why: {
      headline: "Settlement records require reconciliation",
      evidence: [
        "Custodian record differs from settlement record by 0.85 units",
        "Automated re-verification running against the latest verified batch",
        "No funds have left custody control",
      ],
      next: "Operations review — re-run verification or escalate to reconciliation team.",
    },
    blocker: "Balance variance under investigation",
    requiredApprover: "Head of Operations",
    actions: ["Re-run verification", "Escalate to reconciliation team", "Retry settlement", "Export audit evidence"],
    primaryAction: "Re-run verification",
    evidencePack: [
      { label: "Verification timestamp", value: "20 Mar 2024, 10:31 UTC" },
      { label: "Settlement certificate", value: "Withheld pending reconciliation" },
      { label: "Settlement reference", value: "0x30d5…54ab" },
      { label: "Compliance decision", value: "In review — no policy breach" },
      { label: "Ledger comparison", value: "Variance 0.85 units" },
      { label: "Audit trail", value: "14 events recorded" },
    ],
    eta: "~20 min",
    approver: "Pending: Alex Rivera",
    reference: "Counterparty settlement • Ref CS-30554",
    value: "$49,385",
    checks: [
      { label: "Settlement cryptographically verified", state: "pending", detail: "Re-verification running" },
      { label: "Final confirmation reached", state: "pending" },
      { label: "Compliance policy satisfied", state: "passed" },
      { label: "Sanctions and AML screening passed", state: "passed" },
      { label: "Treasury ledger matched", state: "blocked", detail: "Variance 0.85 units" },
      { label: "Audit evidence available", state: "pending", detail: "Incomplete" },
    ],
  },
];

const predictiveRisks = [
  {
    risk: "medium-risk" as const,
    level: "Medium",
    title: "Verification queue delaying one $500,000 stablecoin settlement",
    tag: "Verification delayed",
    time: "5 min ago",
    action: "Request priority verification",
  },
  {
    risk: "medium-risk" as const,
    level: "Medium",
    title: "Final confirmation running behind schedule on two settlements",
    tag: "Awaiting final confirmation",
    time: "8 min ago",
    action: "Notify counterparties",
  },
  {
    risk: "high-risk" as const,
    level: "High",
    title: "Custodian and settlement records differ on 1 counterparty account",
    tag: "Records require reconciliation",
    time: "12 min ago",
    action: "Re-run verification",
  },
  {
    risk: "high-risk" as const,
    level: "High",
    title: "Transfer above mandate limit awaiting CFO decision",
    tag: "Compliance hold",
    time: "18 min ago",
    action: "Review and approve",
  },
  {
    risk: "medium-risk" as const,
    level: "Medium",
    title: "Two settlements awaiting final verification against treasury ledger",
    tag: "Verification pending",
    time: "26 min ago",
    action: "Re-run verification",
  },
];

const proofLabels: Record<Transaction["proofStatus"], { label: string; badge: string }> = {
  verified: { label: "Verified", badge: "low-risk" },
  generating: { label: "Verifying", badge: "medium-risk" },
  delayed: { label: "Needs reconciliation", badge: "high-risk" },
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

function ExplainPanel({ tx, onOpenEvidence }: { tx: Transaction; onOpenEvidence: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* What happened / why */}
      <div>
        <div className="text-sm font-semibold mb-1">Current state</div>
        <p className="text-[15px] text-[#0F172A] mb-3">{tx.statusLabel}</p>

        <div className="text-sm font-semibold mb-1">Reason</div>
        <p className="text-[14px] text-[#475569] mb-3">{tx.why.headline}</p>

        <div className="text-sm font-semibold mb-1">Current blocker</div>
        <p className="text-[14px] text-[#475569] mb-3">{tx.blocker}</p>

        <div className="text-sm font-semibold mb-1">Required approver</div>
        <p className="text-[14px] text-[#475569] mb-3">{tx.requiredApprover}</p>

        <div className="text-sm font-semibold mb-1">Estimated resolution</div>
        <p className="text-[14px] text-[#475569]">{tx.eta}</p>
      </div>

      {/* Confidence evidence */}
      <div>
        <div className="text-sm font-semibold mb-3">
          Why we are {tx.confidence}% confident
        </div>
        <div className="space-y-2.5">
          {tx.checks.map((c) => (
            <CheckRow key={c.label} check={c} />
          ))}
        </div>
      </div>

      {/* Next actions */}
      <div>
        <div className="text-sm font-semibold mb-3">Recommended actions</div>
        <div className="flex flex-col gap-2 items-start">
          {tx.actions.map((a) => (
            <Button
              key={a}
              size="sm"
              variant={a === tx.primaryAction ? "default" : "outline"}
              className={a === tx.primaryAction ? "" : "border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5"}
            >
              {a}
            </Button>
          ))}
        </div>
        <div className="text-sm font-semibold mt-5 mb-2">Supporting evidence</div>
        <ul className="space-y-1 mb-3">
          {tx.why.evidence.map((e) => (
            <li key={e} className="text-[13px] text-[#475569]">• {e}</li>
          ))}
        </ul>
        <Button
          size="sm"
          variant="outline"
          className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5"
          onClick={onOpenEvidence}
        >
          <FileText className="w-3.5 h-3.5 mr-2" />
          Inspect evidence
        </Button>
      </div>
    </div>
  );
}

export default function Transactions() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layerFilter, setLayerFilter] = useState("all");
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedTx(expandedTx === id ? null : id);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Transaction Confidence Dashboard</h1>
          <p className="text-muted-foreground">
            Every transaction explained — what happened, why, and what to do next
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
              <SelectValue placeholder="Current state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              <SelectItem value="settled">Settled</SelectItem>
              <SelectItem value="finality">Awaiting final confirmation</SelectItem>
              <SelectItem value="proof">Verification in progress</SelectItem>
              <SelectItem value="compliance">Compliance hold</SelectItem>
              <SelectItem value="review">Requires reconciliation</SelectItem>
            </SelectContent>
          </Select>
          <Select value={layerFilter} onValueChange={setLayerFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Needs decision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All transactions</SelectItem>
              <SelectItem value="action">Needs my decision</SelectItem>
              <SelectItem value="waiting">Waiting on the platform</SelectItem>
              <SelectItem value="done">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Needs attention */}
      <Card className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-1">Needs attention (last 24h)</h2>
        <p className="text-[13px] text-[#64748B] mb-4">Ranked by business impact — each item has a next action</p>
        <div className="divide-y divide-[#E2E8F0]">
          {predictiveRisks.map((r) => (
            <div key={r.title} className="flex items-center gap-4 h-[52px]">
              <StatusBadge status={r.risk} className="shrink-0">{r.level}</StatusBadge>
              <p className="text-[14px] font-medium text-[#0F172A] flex-1">{r.title}</p>
              <span className="inline-flex items-center justify-center rounded-full bg-[#E8EEFA] text-[#1E3A8A] font-medium text-[13px] px-[14px] h-[28px]">
                {r.tag}
              </span>
              <span className="text-[13px] text-[#64748B]">{r.time}</span>
              <Button
                size="sm"
                variant="outline"
                className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5 shrink-0"
              >
                {r.action}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Mini KPIs */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          title="Awaiting Your Decision"
          value="2"
          subtitle="Compliance hold and reconciliation review"
          icon={Clock}
          status="warning"
        />
        <KPICard
          title="Value Held by Exceptions"
          value="$176.6K"
          subtitle="Across 2 transactions requiring action"
          icon={ShieldCheck}
          status="warning"
        />
        <KPICard
          title="Settling Without Intervention"
          value="3"
          subtitle="Expected to complete within 15 minutes"
          icon={TrendingUp}
          status="success"
        />
        <KPICard
          title="Audit Evidence Complete"
          value="4 / 5"
          subtitle="One package pending reconciliation"
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
                <th className="text-left px-6 py-4 text-sm font-semibold">Institution</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Verification</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Compliance</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Confidence</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">What happened</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Next action</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Owner</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Resolution</th>
                <th className="text-left px-6 py-4 text-sm font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <Fragment key={tx.id}>
                  <tr
                    key={tx.id}
                    onClick={() => toggle(tx.id)}
                    className="border-t border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-[#0F172A]">{tx.institution}</div>
                      <div className="text-[13px] text-[#64748B]">{tx.reference} • {tx.value}</div>
                    </td>
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
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(tx.id);
                        }}
                      >
                        {tx.primaryAction}
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-sm">{tx.approver}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {tx.eta}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggle(tx.id);
                          }}
                          title="Explain"
                        >
                          Explain
                          <ChevronDown
                            className={`w-3.5 h-3.5 ml-1 transition-transform ${
                              expandedTx === tx.id ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(tx.id);
                          }}
                          title="Copy Transaction ID"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTx(tx);
                          }}
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {expandedTx === tx.id && (
                    <tr key={`${tx.id}-explain`} className="bg-muted/20 border-t border-border">
                      <td colSpan={9} className="px-6 py-5">
                        <ExplainPanel tx={tx} onOpenEvidence={() => setSelectedTx(tx)} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Evidence Modal */}
      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Evidence and explanation</DialogTitle>
            <DialogDescription>
              {selectedTx?.id} • {selectedTx?.institution}
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-6 mt-4">
              {/* Confidence */}
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="text-sm font-semibold">Why we are {selectedTx.confidence}% confident</h3>
                  <span className="text-[13px] text-[#64748B]">{selectedTx.statusLabel}</span>
                </div>
                <div className="space-y-3">
                  {selectedTx.checks.map((c) => (
                    <CheckRow key={c.label} check={c} />
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-2">What happened and why</h3>
                <p className="text-[15px] text-[#0F172A] mb-2">{selectedTx.why.headline}</p>
                <ul className="space-y-1.5 mb-2">
                  {selectedTx.why.evidence.map((e) => (
                    <li key={e} className="text-[14px] text-[#475569]">• {e}</li>
                  ))}
                </ul>
                <p className="text-[14px] font-medium text-[#1E3A8A]">{selectedTx.why.next}</p>
              </div>

              {/* Evidence pack */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold mb-3">Supporting records</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedTx.evidencePack.map((e) => (
                    <div key={e.label}>
                      <div className="text-sm text-muted-foreground mb-1">{e.label}</div>
                      <div className="font-medium text-[14px]">{e.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Institution</div>
                  <div className="font-medium">{selectedTx.institution}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Required approver</div>
                  <div className="font-medium">{selectedTx.requiredApprover}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current blocker</div>
                  <div className="font-medium">{selectedTx.blocker}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated resolution</div>
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
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {selectedTx.actions.map((a) => (
                  <Button
                    key={a}
                    variant={a === selectedTx.primaryAction ? "default" : "outline"}
                    className="flex-1 min-w-[180px]"
                  >
                    {a}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
