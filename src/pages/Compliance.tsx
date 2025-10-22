import { useState } from "react";
import { AlertCircle, CheckCircle, Clock, TrendingUp, Copy, ExternalLink, Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ComplianceCase {
  id: string;
  title: string;
  subtitle: string;
  address: string;
  description: string;
  reason: string;
  type: string;
  riskLevel: "low" | "medium" | "high";
  status: "under-review" | "cleared" | "blocked";
  assignedTo: string;
  avatar: string;
  eta: string;
  confidence: number;
  recommendation: "proceed" | "review" | "escalate";
  details: string;
  timeline: Array<{ time: string; action: string; result: string }>;
  nextSteps: string[];
}

const mockCases: ComplianceCase[] = [
  {
    id: "CMP-2024-015",
    title: "KYT Alert",
    subtitle: "Sanctions Screening",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    description: "Destination address was created less than 24 hours ago. Currently analyzing transaction patterns.",
    reason: "New address under 24h old",
    type: "KYT",
    riskLevel: "high",
    status: "under-review",
    assignedTo: "Michael Torres",
    avatar: "MT",
    eta: "~2h",
    confidence: 72,
    recommendation: "review",
    details: "Destination address was created less than 24 hours ago. Currently analyzing transaction patterns and source verification.",
    timeline: [
      { time: "14:45", action: "KYT API check initiated", result: "Address flagged" },
      { time: "14:47", action: "TRM Labs confirmation", result: "Under review" },
      { time: "14:50", action: "Manual review assigned", result: "Officer notified" },
    ],
    nextSteps: [
      "Recalculate KYT score after 6h address age",
      "Verify source wallet history via Chainalysis",
      "Await TRM Labs final confirmation"
    ]
  },
  {
    id: "CMP-2024-016",
    title: "Unusual Activity",
    subtitle: "Transaction Pattern",
    address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    description: "Transaction pattern shows unusual behavior but cleared after review by compliance team.",
    reason: "Unusual transaction pattern",
    type: "Pattern Analysis",
    riskLevel: "low",
    status: "cleared",
    assignedTo: "Jessica Park",
    avatar: "JP",
    eta: "Completed",
    confidence: 95,
    recommendation: "proceed",
    details: "Transaction pattern shows unusual behavior but cleared after review by compliance team.",
    timeline: [
      { time: "10:30", action: "Pattern detection", result: "Flagged" },
      { time: "10:35", action: "Historical review", result: "No risk found" },
      { time: "10:40", action: "Compliance clearance", result: "Approved" },
    ],
    nextSteps: []
  },
  {
    id: "CMP-2024-017",
    title: "Limit Breach",
    subtitle: "Transaction Limit",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    description: "Transaction exceeded standard cross-border limit. Pending approval from compliance committee.",
    reason: "Cross-border transaction limit",
    type: "Limit Breach",
    riskLevel: "medium",
    status: "under-review",
    assignedTo: "David Kim",
    avatar: "DK",
    eta: "~3h",
    confidence: 88,
    recommendation: "review",
    details: "Transaction exceeded standard cross-border limit. Pending approval from compliance committee.",
    timeline: [
      { time: "12:15", action: "Limit breach detected", result: "Automatic hold" },
      { time: "12:20", action: "Committee review assigned", result: "Under review" },
    ],
    nextSteps: [
      "Await compliance committee decision",
      "Verify source of funds",
      "Check pre-approval registry"
    ]
  },
  {
    id: "CMP-2024-018",
    title: "Geographic Restriction",
    subtitle: "Sanctioned Region",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    description: "Counterparty located in restricted jurisdiction. Transaction blocked pending legal review.",
    reason: "Geographic restriction violation",
    type: "Geographic",
    riskLevel: "high",
    status: "blocked",
    assignedTo: "Sarah Chen",
    avatar: "SC",
    eta: "Escalated",
    confidence: 92,
    recommendation: "escalate",
    details: "Counterparty located in restricted jurisdiction. Transaction blocked pending legal review.",
    timeline: [
      { time: "09:00", action: "Geographic check", result: "Restricted region detected" },
      { time: "09:02", action: "Transaction blocked", result: "Automatic hold" },
      { time: "09:05", action: "Legal team notified", result: "Under investigation" },
    ],
    nextSteps: [
      "Escalate to legal team",
      "Review OFAC compliance",
      "Determine permanent block status"
    ]
  },
  {
    id: "CMP-2024-019",
    title: "AML Check",
    subtitle: "Source Verification",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    description: "Source verification completed successfully. No suspicious patterns detected.",
    reason: "Routine AML screening",
    type: "AML",
    riskLevel: "low",
    status: "cleared",
    assignedTo: "Robert Lee",
    avatar: "RL",
    eta: "Completed",
    confidence: 98,
    recommendation: "proceed",
    details: "Source verification completed successfully. No suspicious patterns detected.",
    timeline: [
      { time: "08:30", action: "AML screening initiated", result: "Started" },
      { time: "08:35", action: "Source verification", result: "Clean record" },
      { time: "08:38", action: "Compliance clearance", result: "Approved" },
    ],
    nextSteps: []
  },
];

export default function Compliance() {
  const [selectedCase, setSelectedCase] = useState<ComplianceCase | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filteredCases = mockCases.filter(c => {
    if (searchQuery && !c.address.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.reason.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (riskFilter !== "all" && c.riskLevel !== riskFilter) return false;
    return true;
  });

  const getRecommendationIcon = (rec: string) => {
    if (rec === "proceed") return <CheckCircle className="w-4 h-4 text-success" />;
    if (rec === "review") return <Clock className="w-4 h-4 text-warning" />;
    return <AlertCircle className="w-4 h-4 text-destructive" />;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold text-[#111827] mb-2">Glass-box Compliance</h1>
        <p className="text-[15px] text-[#6B7280]">
          Comprehensive compliance monitoring with full audit trail and reasoning transparency.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <Input
            placeholder="Search address or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[#E2E8F0] h-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white border-[#E2E8F0] h-10">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="cleared">Cleared</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[180px] bg-white border-[#E2E8F0] h-10">
            <SelectValue placeholder="All Risk Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto h-10 border-[#E2E8F0]">
          Export All
        </Button>
      </div>

      {/* Compliance Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {filteredCases.map((complianceCase) => (
          <Card
            key={complianceCase.id}
            className="bg-white rounded-2xl p-6 cursor-pointer flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow relative"
            onClick={() => setSelectedCase(complianceCase)}
          >
            {/* Status and Risk Badges - Top Right, Stacked Vertically */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <StatusBadge status={complianceCase.status}>
                {complianceCase.status === "under-review" ? "Under Review" : 
                 complianceCase.status === "cleared" ? "Cleared" : "Blocked"}
              </StatusBadge>
              <StatusBadge status={`${complianceCase.riskLevel}-risk` as any}>
                {complianceCase.riskLevel === "low" ? "Low Risk" : 
                 complianceCase.riskLevel === "medium" ? "Medium Risk" : "High Risk"}
              </StatusBadge>
            </div>

            {/* Header - Title and Subtitle */}
            <div className="pr-32 mb-3">
              <h3 className="text-[18px] font-semibold text-[#111827] mb-2">{complianceCase.title}</h3>
              <p className="text-[15px] text-[#334155]">{complianceCase.subtitle}</p>
            </div>

            {/* Address */}
            <div className="mb-2">
              <div className="flex items-center gap-2 bg-[#F3F5F9] border border-[#E2E8F0] px-4 py-2.5 rounded-lg">
                <code className="text-[14px] font-mono flex-1 truncate text-[#111827]">
                  {complianceCase.address}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-[#6B7280] hover:text-[#111827] hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(complianceCase.address);
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-[#6B7280] hover:text-[#111827] hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://etherscan.io/address/${complianceCase.address}`, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <p className="text-[14px] leading-[150%] text-[#334155] mb-6 line-clamp-2">
              {complianceCase.description}
            </p>

            {/* Spacer to push footer content to bottom */}
            <div className="flex-1" />

            {/* Responsible & ETA */}
            <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#E2E8F0]">
              <div>
                <div className="text-[13px] text-[#6B7280] mb-1">Responsible</div>
                <div className="text-[14px] font-medium text-[#111827]">{complianceCase.assignedTo}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] text-[#6B7280] mb-1">ETA</div>
                <div className="text-[14px] font-medium text-[#111827]">{complianceCase.eta}</div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              className="w-full h-10 disabled:opacity-40 disabled:cursor-not-allowed bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              disabled={complianceCase.status === "cleared" || complianceCase.status === "blocked"}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCase(complianceCase);
              }}
            >
              Resolve Case
            </Button>
          </Card>
        ))}
      </div>

      {/* Case Details Modal */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compliance Case Details</DialogTitle>
            <DialogDescription>
              {selectedCase?.id} • {selectedCase?.type}
            </DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <div className="space-y-6 mt-4">
              {/* Case Overview */}
              <Card className="glass-panel p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Reason</div>
                    <div className="font-medium">{selectedCase.reason}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                    <StatusBadge status={`${selectedCase.riskLevel}-risk` as any}>
                      {selectedCase.riskLevel === "low" ? "Low Risk" : 
                       selectedCase.riskLevel === "medium" ? "Medium Risk" : "High Risk"}
                    </StatusBadge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Assigned Officer</div>
                    <div className="font-medium">{selectedCase.assignedTo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Confidence Score</div>
                    <div className="font-semibold text-lg">{selectedCase.confidence}%</div>
                  </div>
                </div>
              </Card>

              {/* Details */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Analysis</h3>
                <p className="text-sm text-muted-foreground">{selectedCase.details}</p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Verified through TRM Labs API and Chainalysis network.
                </p>
              </div>

              {/* Recommendation */}
              <Card className="glass-panel p-4 border-l-4 border-l-glow">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  Recommendation
                </h3>
                <div className="flex items-center gap-2">
                  {getRecommendationIcon(selectedCase.recommendation)}
                  <span className="text-lg font-semibold capitalize">
                    {selectedCase.recommendation}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Confidence: <span className="font-semibold text-foreground">{selectedCase.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Based on 3 KYT sources and address history analysis
                </p>
              </Card>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Action Timeline</h3>
                <div className="space-y-3">
                  {selectedCase.timeline.map((event, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="text-sm text-muted-foreground w-16">{event.time}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{event.action}</div>
                        <div className="text-xs text-muted-foreground">{event.result}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              {selectedCase.nextSteps.length > 0 && (
                <Card className="glass-panel p-4 border-l-4 border-l-secondary">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2">
                    {selectedCase.nextSteps.map((step, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-muted-foreground">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedCase.status === "under-review" && (
                  <>
                    <Button className="flex-1 bg-success hover:bg-success/90">
                      Mark as Cleared
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Send for Manual Review
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Export Log
                    </Button>
                  </>
                )}
                {selectedCase.status === "cleared" && (
                  <>
                    <Button variant="outline" className="flex-1">
                      View Clearance Report
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Export Log
                    </Button>
                  </>
                )}
                {selectedCase.status === "blocked" && (
                  <>
                    <Button variant="destructive" className="flex-1">
                      Escalate to Risk Committee
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      Export Log
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
