import { useState } from "react";
import { Shield, AlertCircle, CheckCircle, Clock, User, TrendingUp } from "lucide-react";
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

interface ComplianceCase {
  id: string;
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
    reason: "New address under 24h old",
    type: "KYT",
    riskLevel: "medium",
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
    id: "CMP-2024-014",
    reason: "Cross-border transaction limit",
    type: "Limit Breach",
    riskLevel: "low",
    status: "cleared",
    assignedTo: "Jessica Park",
    avatar: "JP",
    eta: "Completed",
    confidence: 95,
    recommendation: "proceed",
    details: "Transaction exceeded standard cross-border limit but was pre-approved by compliance committee.",
    timeline: [
      { time: "12:30", action: "Limit breach detected", result: "Automatic hold" },
      { time: "12:35", action: "Pre-approval check", result: "Found in registry" },
      { time: "12:36", action: "Compliance clearance", result: "Approved" },
    ],
    nextSteps: []
  },
  {
    id: "CMP-2024-013",
    reason: "Sanctions list match (0.85 similarity)",
    type: "Sanctions",
    riskLevel: "high",
    status: "blocked",
    assignedTo: "David Kim",
    avatar: "DK",
    eta: "Escalated",
    confidence: 88,
    recommendation: "escalate",
    details: "Counterparty name shows 85% similarity to sanctioned entity. Transaction blocked pending Risk Committee review.",
    timeline: [
      { time: "09:15", action: "OFAC screening", result: "Match detected" },
      { time: "09:16", action: "Transaction blocked", result: "Automatic hold" },
      { time: "09:20", action: "Risk Committee notified", result: "Under investigation" },
    ],
    nextSteps: [
      "Escalate to Risk Committee",
      "Request additional KYC documentation",
      "Legal review required before clearance"
    ]
  },
];

export default function Compliance() {
  const [selectedCase, setSelectedCase] = useState<ComplianceCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filteredCases = mockCases.filter(c => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading mb-2">Glass-box Compliance</h1>
          <p className="text-muted-foreground">
            Visible, traceable, and instructive compliance operations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 glass-panel">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="cleared">Cleared</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-48 glass-panel">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Compliance Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((complianceCase) => (
          <Card
            key={complianceCase.id}
            className="glass-panel-hover rounded-2xl p-6 cursor-pointer"
            onClick={() => setSelectedCase(complianceCase)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {complianceCase.avatar}
                </div>
                <div>
                  <div className="font-medium">{complianceCase.assignedTo}</div>
                  <div className="text-xs text-muted-foreground">Compliance Officer</div>
                </div>
              </div>
              <StatusBadge status={complianceCase.riskLevel}>
                {complianceCase.riskLevel.toUpperCase()}
              </StatusBadge>
            </div>

            {/* Case Details */}
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium mb-1">{complianceCase.reason}</div>
                <div className="text-xs text-muted-foreground">{complianceCase.type}</div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Case ID</span>
                <span className="font-mono">{complianceCase.id}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={complianceCase.status}>
                  {complianceCase.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </StatusBadge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ETA</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {complianceCase.eta}
                </span>
              </div>

              {/* Confidence & Recommendation */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold">{complianceCase.confidence}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-glow transition-all duration-500"
                    style={{ width: `${complianceCase.confidence}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {getRecommendationIcon(complianceCase.recommendation)}
                <span className="text-sm font-medium capitalize">
                  {complianceCase.recommendation}
                </span>
              </div>
            </div>
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
                    <StatusBadge status={selectedCase.riskLevel}>
                      {selectedCase.riskLevel.toUpperCase()}
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
                  </>
                )}
                {selectedCase.status === "cleared" && (
                  <Button variant="outline" className="w-full">
                    View Clearance Report
                  </Button>
                )}
                {selectedCase.status === "blocked" && (
                  <Button variant="destructive" className="w-full">
                    Escalate to Risk Committee
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
