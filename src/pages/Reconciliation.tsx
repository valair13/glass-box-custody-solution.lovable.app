import { Download, FileText, AlertTriangle, TrendingUp, RefreshCw, BarChart3, FileCheck, Boxes, RefreshCcw, FileSearch, Hexagon, Circle, Zap, Triangle, Network } from "lucide-react";
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
  networkStatus: "operational" | "delayed" | "degraded" | "offline";
  assetsTracked: number;
}

const getChainIcon = (chainName: string) => {
  const iconProps = { className: "w-5 h-5 text-[#1E3A8A]", strokeWidth: 2 };
  
  switch (chainName) {
    case "Ethereum":
      return <Hexagon {...iconProps} />;
    case "Bitcoin":
      return <Circle {...iconProps} />;
    case "Solana":
      return <Zap {...iconProps} />;
    case "Polygon":
      return <Hexagon {...iconProps} fill="currentColor" fillOpacity={0.2} />;
    case "Avalanche":
      return <Triangle {...iconProps} />;
    case "Arbitrum":
      return <Network {...iconProps} />;
    default:
      return <Circle {...iconProps} />;
  }
};

const chainData: ChainData[] = [
  {
    chain: "Ethereum",
    asset: "ETH, USDC, USDT",
    confirmed: "18,520",
    pending: "850",
    underReview: "0",
    lastVerified: "2 min ago",
    risk: "low",
    reconciliation: 98.2,
    networkStatus: "operational",
    assetsTracked: 3,
  },
  {
    chain: "Bitcoin",
    asset: "BTC",
    confirmed: "32,150",
    pending: "420",
    underReview: "0",
    lastVerified: "5 min ago",
    risk: "low",
    reconciliation: 99.1,
    networkStatus: "operational",
    assetsTracked: 1,
  },
  {
    chain: "Solana",
    asset: "SOL, USDC",
    confirmed: "25,430",
    pending: "1,250",
    underReview: "120",
    lastVerified: "8 min ago",
    risk: "medium",
    reconciliation: 95.3,
    networkNote: "Network congestion detected. Reconciliation delayed.",
    networkStatus: "delayed",
    assetsTracked: 2,
  },
  {
    chain: "Polygon",
    asset: "MATIC, USDC",
    confirmed: "14,280",
    pending: "380",
    underReview: "0",
    lastVerified: "3 min ago",
    risk: "low",
    reconciliation: 97.4,
    networkStatus: "operational",
    assetsTracked: 2,
  },
  {
    chain: "Avalanche",
    asset: "AVAX, USDC",
    confirmed: "9,640",
    pending: "210",
    underReview: "0",
    lastVerified: "4 min ago",
    risk: "low",
    reconciliation: 97.9,
    networkStatus: "operational",
    assetsTracked: 2,
  },
  {
    chain: "Arbitrum",
    asset: "ETH, USDC",
    confirmed: "11,850",
    pending: "450",
    underReview: "0",
    lastVerified: "6 min ago",
    risk: "low",
    reconciliation: 96.3,
    networkStatus: "operational",
    assetsTracked: 2,
  },
];

export default function Reconciliation() {
  const totalChains = chainData.length;
  const chainsWithIssues = chainData.filter(c => c.reconciliation < 95 || c.networkNote).length;
  const operationalChains = totalChains - chainsWithIssues;
  
  const avgReconciliation = chainData.reduce((acc, c) => acc + c.reconciliation, 0) / chainData.length;
  
  const totalUnderReview = chainData.reduce((acc, c) => acc + parseInt(c.underReview.replace(/,/g, '')), 0);
  const chainsWithReview = chainData.filter(c => parseInt(c.underReview.replace(/,/g, '')) > 0).length;

  return (
    <TooltipProvider>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-semibold text-[#111827] mb-2">Cross-chain Reconciliation Hub</h1>
          <p className="text-[15px] text-[#6B7280]">
            Multi-chain asset reporting and compliance status in one audit-friendly view
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Total Chains"
            value={totalChains.toString()}
            subtitle={`${operationalChains} operational • ${chainsWithIssues} has issue`}
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <Boxes className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />
          
          <KPICard
            title="Avg Reconciliation"
            value={`${avgReconciliation.toFixed(1)}%`}
            subtitle="+0.3% from yesterday"
            trend="up"
            icon={
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E8EEFA]">
                <RefreshCcw className="w-6 h-6 text-[#1E3A8A]" strokeWidth={2} />
              </div>
            }
          />
          
          <KPICard
            title="Items Under Review"
            value={totalUnderReview.toLocaleString()}
            subtitle={`Across ${chainsWithReview} chains`}
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
            Refresh All Chains
          </Button>
        </div>

      {/* Chain Reconciliation Table */}
      <Card className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Chain</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Asset</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Confirmed</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Pending</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Under Review</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Last Verified</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Reconciliation Level</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Network Health</th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chainData.map((chain) => (
                <>
                  <tr
                    key={chain.chain}
                    className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center">
                          {getChainIcon(chain.chain)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-medium text-[#111827]">{chain.chain}</span>
                          {chain.networkNote && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertTriangle className="w-4 h-4 text-[#B45309] cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-[#92400E]">
                                <p>{chain.networkNote}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#6B7280]">{chain.asset}</td>
                    <td className="px-6 py-4 text-[14px] font-medium text-[#2563EB]">{chain.confirmed}</td>
                    <td className="px-6 py-4 text-[14px] text-[#5671B0]">{chain.pending}</td>
                    <td className="px-6 py-4 text-[14px] text-[#6B7280]">{chain.underReview}</td>
                    <td className="px-6 py-4 text-[14px] text-[#6B7280]">{chain.lastVerified}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px]">
                          <div className="h-2 bg-[#DCE6FF] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#5671B0] to-[#2563EB] transition-all duration-500"
                              style={{ width: `${chain.reconciliation}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[13px] font-semibold text-[#111827] w-12 text-right">
                          {chain.reconciliation}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={`${chain.risk}-risk` as any}>
                        {chain.risk === "low" ? "Low" : chain.risk === "medium" ? "Medium" : "High"}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="border-[#E2E8F0] text-[#5671B0] hover:bg-[#5671B0]/5">
                        Details
                      </Button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Blockchain House Map */}
      <Card className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
        <h2 className="text-[18px] font-semibold text-[#111827] mb-6">Blockchain House Map</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {chainData.map((chain) => {
            const statusConfig = {
              operational: { label: "Operational", color: "#15803D", bg: "#F0FDF4" },
              delayed: { label: "Delayed", color: "#B45309", bg: "#FFFBEB" },
              degraded: { label: "Degraded", color: "#D97706", bg: "#FEF3C7" },
              offline: { label: "Offline", color: "#B91C1C", bg: "#FEF2F2" },
            };
            
            const status = statusConfig[chain.networkStatus];
            
            return (
              <Tooltip key={chain.chain}>
                <TooltipTrigger asChild>
                  <div
                    className="rounded-xl p-4 transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 bg-[#F8FAFC] border-[#E2E8F0]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center mb-3">
                      <span className="text-[#1E293B] text-sm font-bold">
                        {chain.chain.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[13px] font-semibold text-[#1E293B] mb-3">{chain.chain}</div>
                    
                    <div className="space-y-2">
                      <div 
                        className="inline-block px-2 py-1 rounded text-[11px] font-semibold"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        {status.label}
                      </div>
                      <div className="text-[12px] text-[#6B7280]">
                        Last Verified: {chain.lastVerified}
                      </div>
                      <div className="text-[12px] text-[#6B7280]">
                        Assets tracked: {chain.assetsTracked}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                {chain.networkNote && (
                  <TooltipContent>
                    <p>{chain.networkNote}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </Card>
      </div>
    </TooltipProvider>
  );
}
