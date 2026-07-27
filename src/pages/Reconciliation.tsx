import { Fragment, useState } from "react";
import {
  Download,
  FileText,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  Boxes,
  RefreshCcw,
  FileSearch,
  Check,
  Clock,
  ChevronDown,
  ArrowRight,
  Building2,
  Landmark,
  Layers,
  ShieldCheck,
  CircleCheck,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type OperationalState =
  | "operational"
  | "needs-attention"
  | "waiting-finality"
  | "compliance-hold"
  | "proof-delayed";

interface ConfidenceEvidence {
  label: string;
  state: "passed" | "pending" | "blocked";
  detail?: string;
}

interface SystemRow {
  system: string;
  scope: string;
  confirmed: string;
  pending: string;
  underReview: string;
  lastVerified: string;
  confidence: number;
  operationalState: OperationalState;
  note?: string;
  reason: string;
  evidence: ConfidenceEvidence[];
  accountsTracked: number;
}

const stateConfig: Record<OperationalState, { label: string; color: string; bg: string; badge: string }> = {
  operational: { label: "Operational", color: "#166534", bg: "#E8F6EE", badge: "low-risk" },
  "needs-attention": { label: "Needs Attention", color: "#946C1E", bg: "#F9EED2", badge: "medium-risk" },
  "waiting-finality": { label: "Awaiting final confirmation", color: "#946C1E", bg: "#F9EED2", badge: "medium-risk" },
  "compliance-hold": { label: "Compliance Hold", color: "#A32323", bg: "#F8D9D9", badge: "high-risk" },
  "proof-delayed": { label: "Verification delayed", color: "#946C1E", bg: "#F9EED2", badge: "medium-risk" },
};

const actionsByState: Record<OperationalState, { primary: string; others: string[] }> = {
  operational: { primary: "Export audit evidence", others: ["Re-run verification", "View reconciliation report"] },
  "needs-attention": { primary: "Re-run verification", others: ["Escalate to reconciliation team", "Export audit evidence"] },
  "waiting-finality": { primary: "Notify counterparty", others: ["Re-run verification", "Export interim evidence"] },
  "compliance-hold": { primary: "Review and approve", others: ["Escalate", "Request additional verification"] },
  "proof-delayed": { primary: "Request priority verification", others: ["Re-run verification", "Notify counterparty"] },
};


const systemData: SystemRow[] = [
  {
    system: "Internal Ledger",
    scope: "Treasury book of record",
    confirmed: "42,180",
    pending: "120",
    underReview: "0",
    lastVerified: "1 min ago",
    confidence: 99.4,
    operationalState: "operational",
    reason: "All positions matched against custodian statements",
    accountsTracked: 38,
    evidence: [
      { label: "Internal ledger matched", state: "passed" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Compliance policy satisfied", state: "passed" },
      { label: "Settlement cryptographically verified", state: "passed" },
      { label: "Final confirmation reached", state: "passed" },
    ],
  },
  {
    system: "Custodian",
    scope: "Qualified custody accounts",
    confirmed: "39,860",
    pending: "310",
    underReview: "0",
    lastVerified: "3 min ago",
    confidence: 98.7,
    operationalState: "operational",
    reason: "Custody statements reconciled with internal ledger",
    accountsTracked: 26,
    evidence: [
      { label: "Internal ledger matched", state: "passed" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Compliance policy satisfied", state: "passed" },
      { label: "Settlement cryptographically verified", state: "passed" },
      { label: "Final confirmation reached", state: "passed" },
    ],
  },
  {
    system: "zkSync Era",
    scope: "Execution and proof layer",
    confirmed: "25,430",
    pending: "1,250",
    underReview: "120",
    lastVerified: "8 min ago",
    confidence: 95.3,
    operationalState: "proof-delayed",
    note: "Verification queued behind a high-volume settlement batch.",
    reason: "Settlement verification delayed on 1 batch",
    accountsTracked: 31,
    evidence: [
      { label: "Settlement cryptographically verified", state: "pending", detail: "Batch #482,131 queued" },
      { label: "Final confirmation reached", state: "pending" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Internal ledger matched", state: "passed" },
      { label: "Compliance policy satisfied", state: "passed" },
    ],
  },
  {
    system: "Ethereum L1",
    scope: "Final settlement layer",
    confirmed: "18,520",
    pending: "850",
    underReview: "0",
    lastVerified: "2 min ago",
    confidence: 97.2,
    operationalState: "waiting-finality",
    note: "Final confirmation window extended during peak network load.",
    reason: "2 settlements awaiting final confirmation",
    accountsTracked: 29,
    evidence: [
      { label: "Settlement cryptographically verified", state: "passed" },
      { label: "Final confirmation reached", state: "pending", detail: "22 / 64 confirmations" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Internal ledger matched", state: "passed" },
      { label: "Compliance policy satisfied", state: "passed" },
    ],
  },
  {
    system: "Compliance Engine",
    scope: "Policy, AML and sanctions",
    confirmed: "14,280",
    pending: "380",
    underReview: "6",
    lastVerified: "3 min ago",
    confidence: 93.1,
    operationalState: "compliance-hold",
    note: "One transfer exceeds treasury policy 14.2 threshold.",
    reason: "Manual approval required on 1 mandate transfer",
    accountsTracked: 18,
    evidence: [
      { label: "Compliance policy satisfied", state: "blocked", detail: "Policy 14.2 threshold exceeded" },
      { label: "Settlement cryptographically verified", state: "passed" },
      { label: "Final confirmation reached", state: "passed" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Internal ledger matched", state: "passed" },
    ],
  },
  {
    system: "Settlement & Reporting",
    scope: "ERP and audit exports",
    confirmed: "11,850",
    pending: "450",
    underReview: "0",
    lastVerified: "6 min ago",
    confidence: 96.3,
    operationalState: "needs-attention",
    note: "Two settlements awaiting final verification against ledger.",
    reason: "Settlement verification pending on 2 records",
    accountsTracked: 22,
    evidence: [
      { label: "Settlement cryptographically verified", state: "passed" },
      { label: "Final confirmation reached", state: "passed" },
      { label: "Treasury ledger matched", state: "pending", detail: "2 records outstanding" },
      { label: "Internal ledger matched", state: "passed" },
      { label: "Compliance policy satisfied", state: "passed" },
    ],
  },
];

const reconciliationChain = [
  { label: "Internal Ledger", detail: "Book of record matched", icon: Building2, done: true },
  { label: "Custodian", detail: "Statements reconciled", icon: Landmark, done: true },
  { label: "Settlement network", detail: "Cryptographically verified", icon: Layers, done: true },
  { label: "Final confirmation", detail: "Irreversible settlement", icon: ShieldCheck, done: true },
  { label: "Settlement completed", detail: "Audit evidence stored", icon: CircleCheck, done: true },
];

const getSystemIcon = (name: string) => {
  const iconProps = { className: "w-5 h-5 text-[#1E3A8A]", strokeWidth: 2 };
  switch (name) {
    case "Internal Ledger":
      return <Building2 {...iconProps} />;
    case "Custodian":
      return <Landmark {...iconProps} />;
    case "zkSync Era":
      return <Layers {...iconProps} />;
    case "Ethereum L1":
      return <ShieldCheck {...iconProps} />;
    case "Compliance Engine":
      return <FileCheck {...iconProps} />;
    default:
      return <CircleCheck {...iconProps} />;
  }
};

function EvidenceRow({ item }: { item: ConfidenceEvidence }) {
  const marks = {
    passed: { symbol: <Check className="w-3.5 h-3.5" />, bg: "#E8F6EE", color: "#166534" },
    pending: { symbol: <Clock className="w-3.5 h-3.5" />, bg: "#F9EED2", color: "#946C1E" },
    blocked: { symbol: <AlertTriangle className="w-3.5 h-3.5" />, bg: "#F8D9D9", color: "#A32323" },
  }[item.state];

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: marks.bg, color: marks.color }}
      >
        {marks.symbol}
      </span>
      <span className="text-[14px] text-[#0F172A]">{item.label}</span>
      {item.detail && <span className="text-[13px] text-[#64748B]">— {item.detail}</span>}
    </div>
  );
}

export default function Reconciliation() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalSystems = systemData.length;
  const systemsWithIssues = systemData.filter((s) => s.operationalState !== "operational").length;
  const operationalSystems = totalSystems - systemsWithIssues;

  const avgConfidence = systemData.reduce((acc, s) => acc + s.confidence, 0) / systemData.length;

  const totalUnderReview = systemData.reduce(
    (acc, s) => acc + parseInt(s.underReview.replace(/,/g, "")),
    0
  );
  const systemsWithReview = systemData.filter(
    (s) => parseInt(s.underReview.replace(/,/g, "")) > 0
  ).length;

  return (
    <TooltipProvider>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-semibold text-[#111827] mb-2">Operational Confidence Hub</h1>
          <p className="text-[15px] text-[#6B7280]">
            Confidence across every system in the settlement chain — ledger, custodian, zkSync and Ethereum
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Systems Monitored"
            value={totalSystems.toString()}
            subtitle={`${operationalSystems} operational • ${systemsWithIssues} need attention`}
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <Boxes className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />

          <KPICard
            title="Confidence Score"
            value={`${avgConfidence.toFixed(1)}%`}
            subtitle="+0.3% from yesterday"
            trend="up"
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <RefreshCcw className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />

          <KPICard
            title="Items Awaiting Explanation"
            value={totalUnderReview.toLocaleString()}
            subtitle={`Across ${systemsWithReview} systems`}
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <FileSearch className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />
        </div>

        {/* Button Row */}
        <div className="flex gap-3">
          <Button variant="outline" className="border-[#E2E8F0]">
            <Download className="w-4 h-4 mr-2" />
            Export to ERP
          </Button>
          <Button variant="outline" className="border-[#E2E8F0]">
            <FileText className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button variant="outline" className="border-[#E2E8F0]">
            <FileCheck className="w-4 h-4 mr-2" />
            Generate Audit Snapshot
          </Button>
          <Button variant="outline" className="border-[#E2E8F0]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-verify All Systems
          </Button>
        </div>

        {/* Settlement Chain */}
        <Card className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-1">Reconciliation Path</h2>
          <p className="text-[14px] text-[#6B7280] mb-6">
            Reconciliation runs across financial systems, not only chains
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {reconciliationChain.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 min-w-[170px]">
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon className="w-4 h-4 text-[#1E3A8A]" strokeWidth={2} />
                    <span className="text-[13px] font-semibold text-[#1E293B]">{step.label}</span>
                  </div>
                  <div className="text-[12px] text-[#6B7280]">{step.detail}</div>
                </div>
                {i < reconciliationChain.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* System Confidence Table */}
        <Card className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">System</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Scope</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Verified</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Pending</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Under Review</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Last Verified</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Confidence Score</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Operational State</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {systemData.map((row) => (
                  <Fragment key={row.system}>
                    <tr
                      key={row.system}
                      className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center">
                            {getSystemIcon(row.system)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-medium text-[#111827]">{row.system}</span>
                            {row.note && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle className="w-4 h-4 text-[#B45309] cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-white text-[#92400E]">
                                  <p>{row.note}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6B7280]">{row.scope}</td>
                      <td className="px-6 py-4 text-[14px] font-medium text-[#2563EB]">{row.confirmed}</td>
                      <td className="px-6 py-4 text-[14px] text-[#5671B0]">{row.pending}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6B7280]">{row.underReview}</td>
                      <td className="px-6 py-4 text-[14px] text-[#6B7280]">{row.lastVerified}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === row.system ? null : row.system)}
                          className="flex items-center gap-3 text-left"
                        >
                          <div className="flex-1 max-w-[120px]">
                            <div className="h-2 bg-[#DCE6FF] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#5671B0] to-[#2563EB] transition-all duration-500"
                                style={{ width: `${row.confidence}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[13px] font-semibold text-[#111827] w-12 text-right">
                            {row.confidence}%
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#94A3B8] transition-transform ${
                              expanded === row.system ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={stateConfig[row.operationalState].badge as any}>
                          {stateConfig[row.operationalState].label}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5"
                          onClick={() => setExpanded(expanded === row.system ? null : row.system)}
                        >
                          Why?
                        </Button>
                      </td>
                    </tr>
                    {expanded === row.system && (
                      <tr key={`${row.system}-why`} className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                        <td colSpan={9} className="px-6 py-5">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div>
                              <div className="text-[13px] font-semibold text-[#111827] mb-1">
                                Why we are {row.confidence}% confident
                              </div>
                              <div className="space-y-2.5 mt-3">
                                {row.evidence.map((e) => (
                                  <EvidenceRow key={e.label} item={e} />
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-[#111827] mb-1">What happened</div>
                              <p className="text-[14px] text-[#0F172A] mb-2">{row.reason}</p>
                              {row.note && <p className="text-[14px] text-[#6B7280]">{row.note}</p>}
                              <div className="text-[13px] font-semibold text-[#111827] mt-4 mb-1">
                                Supporting records
                              </div>
                              <ul className="space-y-1">
                                <li className="text-[13px] text-[#475569]">• Last verification: {row.lastVerified}</li>
                                <li className="text-[13px] text-[#475569]">• Accounts in scope: {row.accountsTracked}</li>
                                <li className="text-[13px] text-[#475569]">• Items awaiting explanation: {row.underReview}</li>
                                <li className="text-[13px] text-[#475569]">• Audit trail available for export</li>
                              </ul>
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-[#111827] mb-3">
                                Recommended actions
                              </div>
                              <div className="flex flex-col gap-2 items-start">
                                <Button size="sm">{actionsByState[row.operationalState].primary}</Button>
                                {actionsByState[row.operationalState].others.map((a) => (
                                  <Button
                                    key={a}
                                    size="sm"
                                    variant="outline"
                                    className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5"
                                  >
                                    {a}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Today's Operational Priorities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="text-[18px] font-semibold text-[#111827] mb-1">Today's Operational Priorities</h2>
            <p className="text-[14px] text-[#6B7280] mb-5">
              Ranked by business impact — each item has a next action
            </p>
            <div className="divide-y divide-[#E2E8F0]">
              {systemData
                .filter((s) => s.operationalState !== "operational")
                .sort((a, b) => a.confidence - b.confidence)
                .map((row, i) => (
                  <div key={row.system} className="flex items-center gap-4 py-3">
                    <span className="w-6 h-6 rounded-full bg-[#E8EEFA] text-[#1E3A8A] text-[12px] font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-[#0F172A]">{row.reason}</div>
                      <div className="text-[13px] text-[#6B7280]">
                        {row.system} • {row.accountsTracked} accounts in scope • confidence {row.confidence}%
                      </div>
                    </div>
                    <StatusBadge status={stateConfig[row.operationalState].badge as any} className="shrink-0">
                      {stateConfig[row.operationalState].label}
                    </StatusBadge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5 shrink-0"
                      onClick={() => setExpanded(row.system)}
                    >
                      {actionsByState[row.operationalState].primary}
                    </Button>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
            <h2 className="text-[18px] font-semibold text-[#111827] mb-1">Audit Readiness</h2>
            <p className="text-[14px] text-[#6B7280] mb-5">Can we defend today's numbers to an auditor?</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[14px] text-[#6B7280]">Overall readiness</span>
                  <span className="text-[14px] font-semibold text-[#111827]">96%</span>
                </div>
                <div className="h-2 bg-[#DCE6FF] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#5671B0] to-[#2563EB]" style={{ width: "96%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[14px] text-[#6B7280]">Evidence completeness</span>
                  <span className="text-[14px] font-semibold text-[#111827]">99%</span>
                </div>
                <div className="h-2 bg-[#DCE6FF] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#5671B0] to-[#2563EB]" style={{ width: "99%" }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#6B7280]">Missing audit documents</span>
                <span className="text-[14px] font-semibold text-[#111827]">2</span>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <Button size="sm">Export audit package</Button>
                <Button size="sm" variant="outline" className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5">
                  Resolve missing documents
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </TooltipProvider>
  );
}
