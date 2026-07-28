import { Fragment, useState } from "react";
import {
  Download,
  FileText,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  Check,
  Clock,
  ChevronDown,
  Building2,
  Landmark,
  Layers,
  ShieldCheck,
  CircleCheck,
  ClipboardList,
  Inbox,
  UserCheck,
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
  | "on-track"
  | "needs-attention"
  | "awaiting-confirmation"
  | "compliance-hold"
  | "verification-delayed";

type ImpactLevel = "none" | "low" | "medium" | "high";

interface EvidenceItem {
  label: string;
  state: "passed" | "pending" | "blocked";
  detail?: string;
}

interface CapabilityRow {
  capability: string;
  scope: string;
  status: OperationalState;
  casesRequiringAttention: number;
  casesTotal: number;
  impact: ImpactLevel;
  impactSummary: string;
  owner: string;
  ownerTeam: string;
  lastCheck: string;
  nextAction: string;
  secondaryActions: string[];
  whatHappened: string;
  note?: string;
  recommendedStep: string;
  resolutionEstimate: string;
  evidence: EvidenceItem[];
}

const stateConfig: Record<OperationalState, { label: string; badge: string }> = {
  "on-track": { label: "On track", badge: "low-risk" },
  "needs-attention": { label: "Needs attention", badge: "medium-risk" },
  "awaiting-confirmation": { label: "Awaiting final confirmation", badge: "medium-risk" },
  "compliance-hold": { label: "Compliance hold", badge: "high-risk" },
  "verification-delayed": { label: "Verification delayed", badge: "medium-risk" },
};

const impactConfig: Record<ImpactLevel, { label: string; color: string; bg: string }> = {
  none: { label: "No client impact", color: "#166534", bg: "#E8F6EE" },
  low: { label: "Low", color: "#166534", bg: "#E8F6EE" },
  medium: { label: "Medium", color: "#946C1E", bg: "#F9EED2" },
  high: { label: "High", color: "#A32323", bg: "#F8D9D9" },
};

const capabilityData: CapabilityRow[] = [
  {
    capability: "Settlement Processing",
    scope: "Client transfers moving to final settlement",
    status: "verification-delayed",
    casesRequiringAttention: 120,
    casesTotal: 26_800,
    impact: "medium",
    impactSummary: "USD 42.8M of client settlements delayed by up to 2 hours",
    owner: "L. Moreau",
    ownerTeam: "Settlement Operations",
    lastCheck: "8 min ago",
    nextAction: "Request priority verification",
    secondaryActions: ["Notify affected clients", "Re-run verification"],
    note: "One high-volume settlement batch is queued ahead of these transfers.",
    whatHappened:
      "A high-volume batch is being verified ahead of 120 client settlements, pushing their completion outside the standard window.",
    recommendedStep:
      "Request priority verification for the affected batch and notify clients with same-day value dates.",
    resolutionEstimate: "~2 hours",
    evidence: [
      { label: "Settlement instructions validated", state: "passed" },
      { label: "Settlement cryptographically verified", state: "pending", detail: "Batch queued" },
      { label: "Final confirmation reached", state: "pending" },
      { label: "Treasury ledger matched", state: "passed" },
    ],
  },
  {
    capability: "Custody Confirmation",
    scope: "Positions confirmed against qualified custodians",
    status: "on-track",
    casesRequiringAttention: 0,
    casesTotal: 39_860,
    impact: "none",
    impactSummary: "All custody positions confirmed and matched",
    owner: "A. Whitfield",
    ownerTeam: "Custody Operations",
    lastCheck: "3 min ago",
    nextAction: "Export daily confirmation",
    secondaryActions: ["View confirmation report"],
    whatHappened:
      "All custody statements received today match the internal book of record with no breaks outstanding.",
    recommendedStep: "No action required. Export the daily confirmation for the operations file.",
    resolutionEstimate: "—",
    evidence: [
      { label: "Custodian statements received", state: "passed" },
      { label: "Positions matched to book of record", state: "passed" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Compliance policy satisfied", state: "passed" },
    ],
  },
  {
    capability: "Compliance Controls",
    scope: "Policy, AML and sanctions screening",
    status: "compliance-hold",
    casesRequiringAttention: 6,
    casesTotal: 14_660,
    impact: "high",
    impactSummary: "1 mandate transfer of USD 18.5M held pending approval",
    owner: "R. Okafor",
    ownerTeam: "Compliance",
    lastCheck: "3 min ago",
    nextAction: "Review and approve",
    secondaryActions: ["Escalate to Head of Compliance", "Request additional documentation"],
    note: "One transfer exceeds treasury policy 14.2 threshold.",
    whatHappened:
      "A mandate transfer exceeds the treasury policy 14.2 value threshold and requires a second approver before it can settle.",
    recommendedStep:
      "Review the transfer against the client mandate and approve, or escalate if the mandate needs amending.",
    resolutionEstimate: "Same day, once approved",
    evidence: [
      { label: "Sanctions screening cleared", state: "passed" },
      { label: "Counterparty verified", state: "passed" },
      { label: "Policy 14.2 threshold check", state: "blocked", detail: "Second approver required" },
      { label: "Settlement cryptographically verified", state: "passed" },
    ],
  },
  {
    capability: "Settlement Finality",
    scope: "Transfers reaching irreversible settlement",
    status: "awaiting-confirmation",
    casesRequiringAttention: 2,
    casesTotal: 19_370,
    impact: "low",
    impactSummary: "2 settlements not yet final; no client value date at risk",
    owner: "L. Moreau",
    ownerTeam: "Settlement Operations",
    lastCheck: "2 min ago",
    nextAction: "Notify counterparty",
    secondaryActions: ["Export interim evidence", "Monitor"],
    note: "Final confirmation window extended during peak volume.",
    whatHappened:
      "Two settlements are inside an extended confirmation window caused by peak market volume. Both are progressing normally.",
    recommendedStep: "Notify the counterparty of the revised completion time and continue monitoring.",
    resolutionEstimate: "~35 minutes",
    evidence: [
      { label: "Settlement cryptographically verified", state: "passed" },
      { label: "Final confirmation reached", state: "pending", detail: "22 of 64 confirmations" },
      { label: "Treasury ledger matched", state: "passed" },
      { label: "Internal ledger matched", state: "passed" },
    ],
  },
  {
    capability: "Settlement Reporting",
    scope: "ERP postings and daily treasury reporting",
    status: "needs-attention",
    casesRequiringAttention: 2,
    casesTotal: 12_300,
    impact: "medium",
    impactSummary: "Two records will miss today's ERP posting cut-off if unresolved",
    owner: "S. Bianchi",
    ownerTeam: "Treasury Reporting",
    lastCheck: "6 min ago",
    nextAction: "Reconcile outstanding records",
    secondaryActions: ["Escalate to reconciliation team", "Export to ERP"],
    note: "Two settlements are not yet matched to the treasury ledger.",
    whatHappened:
      "Two completed settlements have not matched to the treasury ledger, so they are excluded from today's ERP posting.",
    recommendedStep:
      "Reconcile the two outstanding records before the 17:00 posting cut-off, then re-run the ERP export.",
    resolutionEstimate: "Before 17:00 cut-off",
    evidence: [
      { label: "Settlement completed", state: "passed" },
      { label: "Treasury ledger matched", state: "pending", detail: "2 records outstanding" },
      { label: "ERP posting prepared", state: "pending" },
      { label: "Internal ledger matched", state: "passed" },
    ],
  },
  {
    capability: "Settlement Evidence",
    scope: "Audit trail and supporting documentation",
    status: "on-track",
    casesRequiringAttention: 0,
    casesTotal: 42_180,
    impact: "none",
    impactSummary: "Complete evidence available for every settled transfer",
    owner: "S. Bianchi",
    ownerTeam: "Treasury Reporting",
    lastCheck: "1 min ago",
    nextAction: "Export evidence pack",
    secondaryActions: ["View audit trail"],
    whatHappened:
      "Every settlement completed today has a full, exportable evidence trail attached.",
    recommendedStep: "No action required. Export the evidence pack when requested by audit.",
    resolutionEstimate: "—",
    evidence: [
      { label: "Settlement certificates stored", state: "passed" },
      { label: "Approval trail captured", state: "passed" },
      { label: "Counterparty confirmations attached", state: "passed" },
      { label: "Evidence pack exportable", state: "passed" },
    ],
  },
];

const getCapabilityIcon = (name: string) => {
  const iconProps = { className: "w-5 h-5 text-[#1E3A8A]", strokeWidth: 2 };
  switch (name) {
    case "Settlement Processing":
      return <Layers {...iconProps} />;
    case "Custody Confirmation":
      return <Landmark {...iconProps} />;
    case "Compliance Controls":
      return <FileCheck {...iconProps} />;
    case "Settlement Finality":
      return <ShieldCheck {...iconProps} />;
    case "Settlement Reporting":
      return <Building2 {...iconProps} />;
    default:
      return <CircleCheck {...iconProps} />;
  }
};

function EvidenceRow({ item }: { item: EvidenceItem }) {
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

const impactRank: Record<ImpactLevel, number> = { high: 0, medium: 1, low: 2, none: 3 };

export default function Reconciliation() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const openIssues = capabilityData.filter((c) => c.status !== "on-track");
  const casesRequiringReview = capabilityData.reduce((acc, c) => acc + c.casesRequiringAttention, 0);
  const awaitingDecision = capabilityData.filter(
    (c) => c.status === "compliance-hold" || c.status === "needs-attention"
  ).length;

  const highImpactIssues = openIssues.filter((c) => c.impact === "high");
  const complianceHolds = openIssues.filter((c) => c.status === "compliance-hold");
  const delayedVerifications = openIssues.filter((c) => c.status === "verification-delayed");

  const settlementStatus = (() => {
    if (complianceHolds.length >= 2 || highImpactIssues.length >= 2) {
      return {
        label: "🔴 Blocked",
        supporting: "Manual intervention required before settlements can continue",
      };
    }
    if (delayedVerifications.length >= 2 || openIssues.length >= 8) {
      return {
        label: "🟠 Delayed",
        supporting: "Settlement delays affecting client operations",
      };
    }
    if (openIssues.length >= 5) {
      return {
        label: "🟡 Attention Required",
        supporting: `${openIssues.length} operational issues require attention`,
      };
    }
    return {
      label: "🟢 On Track",
      supporting: `${openIssues.length} operational issue${openIssues.length === 1 ? "" : "s"} require${openIssues.length === 1 ? "s" : ""} attention`,
    };
  })();

  const priorities = [...openIssues].sort(
    (a, b) => impactRank[a.impact] - impactRank[b.impact] || b.casesRequiringAttention - a.casesRequiringAttention
  );

  return (
    <TooltipProvider>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-semibold text-[#111827] mb-2">Settlement Assurance</h1>
          <p className="text-[15px] text-[#6B7280]">
            Monitor today's institutional settlement operations, identify operational risks and take
            action before they affect business operations
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard
            title="Today's Settlement Status"
            value={settlementStatus.label}
            subtitle={settlementStatus.supporting}
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <ClipboardList className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />

          <KPICard
            title="Open Operational Issues"
            value={openIssues.length.toString()}
            subtitle={`${openIssues.filter((c) => c.impact === "high").length} with high business impact`}
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <AlertTriangle className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />

          <KPICard
            title="Transactions Requiring Review"
            value={casesRequiringReview.toLocaleString()}
            subtitle={`Across ${openIssues.length} business capabilities`}
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <Inbox className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />

          <KPICard
            title="Awaiting Your Decision"
            value={awaitingDecision.toString()}
            subtitle="Approvals and reconciliations assigned to you"
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <UserCheck className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
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
            Daily settlement report
          </Button>
          <Button variant="outline" className="border-[#E2E8F0]">
            <FileCheck className="w-4 h-4 mr-2" />
            Export evidence pack
          </Button>
          <Button variant="outline" className="border-[#E2E8F0]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-run all checks
          </Button>
        </div>

        {/* Operational Capability Table */}
        <Card className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-[18px] font-semibold text-[#111827] mb-1">
              Operational areas
            </h2>
            <p className="text-[14px] text-[#6B7280]">
              Health of today's settlement operations, with the owner and next action for each area
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Business Capability</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Current Status</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Cases Requiring Attention</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Business Impact</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Owner</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Last Check</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Next Action</th>
                  <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]"></th>
                </tr>
              </thead>
              <tbody>
                {capabilityData.map((row) => (
                  <Fragment key={row.capability}>
                    <tr className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getCapabilityIcon(row.capability)}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[14px] font-medium text-[#111827]">{row.capability}</span>
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
                            <div className="text-[13px] text-[#6B7280]">{row.scope}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={stateConfig[row.status].badge as any}>
                          {stateConfig[row.status].label}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px] font-medium text-[#2563EB]">
                          {row.casesRequiringAttention === 0 ? "None" : row.casesRequiringAttention.toLocaleString()}
                        </div>
                        <div className="text-[13px] text-[#6B7280]">
                          of {row.casesTotal.toLocaleString()} processed today
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center rounded-full px-3 h-[28px] text-[12px] font-medium"
                          style={{
                            backgroundColor: impactConfig[row.impact].bg,
                            color: impactConfig[row.impact].color,
                          }}
                        >
                          {impactConfig[row.impact].label}
                        </span>
                        <div className="text-[13px] text-[#6B7280] mt-1 max-w-[260px]">
                          {row.impactSummary}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px] text-[#111827]">{row.owner}</div>
                        <div className="text-[13px] text-[#6B7280]">{row.ownerTeam}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#6B7280]">{row.lastCheck}</td>
                      <td className="px-6 py-4">
                        <Button size="sm">{row.nextAction}</Button>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5"
                          onClick={() => setExpanded(expanded === row.capability ? null : row.capability)}
                        >
                          Explain
                          <ChevronDown
                            className={`w-4 h-4 ml-1.5 transition-transform ${
                              expanded === row.capability ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </td>
                    </tr>
                    {expanded === row.capability && (
                      <tr className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div>
                              <div className="text-[13px] font-semibold text-[#111827] mb-1">What happened</div>
                              <p className="text-[14px] text-[#0F172A] mb-3">{row.whatHappened}</p>
                              <div className="text-[13px] font-semibold text-[#111827] mb-1">Business impact</div>
                              <p className="text-[14px] text-[#0F172A]">{row.impactSummary}</p>
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-[#111827] mb-1">Recommended next step</div>
                              <p className="text-[14px] text-[#0F172A] mb-3">{row.recommendedStep}</p>
                              <ul className="space-y-1">
                                <li className="text-[13px] text-[#475569]">• Owner: {row.owner} — {row.ownerTeam}</li>
                                <li className="text-[13px] text-[#475569]">• Expected resolution: {row.resolutionEstimate}</li>
                                <li className="text-[13px] text-[#475569]">• Last check: {row.lastCheck}</li>
                                <li className="text-[13px] text-[#475569]">• Cases requiring attention: {row.casesRequiringAttention || "none"}</li>
                              </ul>
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-[#111827] mb-3">Checks completed</div>
                              <div className="space-y-2.5 mb-4">
                                {row.evidence.map((e) => (
                                  <EvidenceRow key={e.label} item={e} />
                                ))}
                              </div>
                              <div className="flex flex-col gap-2 items-start">
                                <Button size="sm">{row.nextAction}</Button>
                                {row.secondaryActions.map((a) => (
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

        {/* Requires Action Today */}
        <Card className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <h2 className="text-[18px] font-semibold text-[#111827] mb-1">Requires action today</h2>
          <p className="text-[14px] text-[#6B7280] mb-5">
            Ranked by business impact — each item has an owner and a recommended action
          </p>
          <div className="divide-y divide-[#E2E8F0]">
            {priorities.map((row, i) => (
              <div key={row.capability} className="flex items-center gap-4 py-3">
                <span className="w-6 h-6 rounded-full bg-[#E8EEFA] text-[#1E3A8A] text-[12px] font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-[#0F172A]">
                    {row.capability} — {row.whatHappened}
                  </div>
                  <div className="text-[13px] text-[#6B7280]">
                    {row.impactSummary} • Owner: {row.owner} • Expected resolution: {row.resolutionEstimate}
                  </div>
                </div>
                <span
                  className="inline-flex items-center rounded-full px-3 h-[28px] text-[12px] font-medium shrink-0"
                  style={{
                    backgroundColor: impactConfig[row.impact].bg,
                    color: impactConfig[row.impact].color,
                  }}
                >
                  {impactConfig[row.impact].label} impact
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5 shrink-0"
                  onClick={() => setExpanded(row.capability)}
                >
                  {row.nextAction}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}
