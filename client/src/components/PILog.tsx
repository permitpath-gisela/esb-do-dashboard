import { performanceIndicators, deliveryObligations } from "@/data/doData";
import { RAGBadge } from "./RAGBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, Zap, Lock } from "lucide-react";

const MECHANISM_CONFIG = {
  "Ex-post disallowance": { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", label: "Ex-post Disallowance" },
  "Direct penalty": { icon: Zap, color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Direct Penalty" },
  "AIMF drawdown blocked": { icon: Lock, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", label: "AIMF Drawdown Blocked" },
};

const STATUS_CONFIG = {
  "At Risk": "bg-red-100 text-red-700 border border-red-200",
  "Crystallised": "bg-gray-100 text-gray-700 border border-gray-200",
  "Managed": "bg-green-100 text-green-700 border border-green-200",
  "Monitoring": "bg-blue-100 text-blue-700 border border-blue-200",
};

export function PILog() {
  const totalExposure = performanceIndicators.reduce((s, p) => s + p.penaltyExposureM, 0);
  const atRiskExposure = performanceIndicators.filter(p => p.status === "At Risk").reduce((s, p) => s + p.penaltyExposureM, 0);

  // Aggregate by mechanism
  const mechanismSummary = [
    {
      name: "Direct Penalty",
      total: performanceIndicators.filter(p => p.mechanism === "Direct penalty").reduce((s, p) => s + p.penaltyExposureM, 0),
      count: performanceIndicators.filter(p => p.mechanism === "Direct penalty").length,
      color: "#dc2626",
    },
    {
      name: "Ex-post Disallowance",
      total: performanceIndicators.filter(p => p.mechanism === "Ex-post disallowance").reduce((s, p) => s + p.penaltyExposureM, 0),
      count: performanceIndicators.filter(p => p.mechanism === "Ex-post disallowance").length,
      color: "#d97706",
    },
    {
      name: "AIMF Drawdown Blocked",
      total: performanceIndicators.filter(p => p.mechanism === "AIMF drawdown blocked").reduce((s, p) => s + p.penaltyExposureM, 0),
      count: performanceIndicators.filter(p => p.mechanism === "AIMF drawdown blocked").length,
      color: "#2563eb",
    },
  ];

  // Top 10 by exposure
  const topByExposure = [...performanceIndicators]
    .sort((a, b) => b.penaltyExposureM - a.penaltyExposureM)
    .slice(0, 10);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#003A70]">PI Exposure Log</h1>
        <p className="text-gray-500 text-sm mt-1">27 Performance Incentives — aggregated financial risk from the AIMF framework</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total PIs</p>
          <p className="text-3xl font-bold text-gray-800">27</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Exposure</p>
          <p className="text-3xl font-bold text-red-700">€{totalExposure.toFixed(0)}M</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">At Risk Exposure</p>
          <p className="text-3xl font-bold text-amber-700">€{atRiskExposure.toFixed(0)}M</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">PIs At Risk</p>
          <p className="text-3xl font-bold text-blue-700">{performanceIndicators.filter(p => p.status === "At Risk").length}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Mechanism Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Exposure by Penalty Mechanism (€M)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mechanismSummary} margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={v => `€${v}M`} />
                <Tooltip formatter={(v: number) => [`€${v.toFixed(1)}M`, "Exposure"]} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {mechanismSummary.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {mechanismSummary.map(m => (
              <div key={m.name} className="text-center">
                <p className="text-xs text-gray-500">{m.count} PIs</p>
                <p className="text-sm font-bold" style={{ color: m.color }}>€{m.total.toFixed(0)}M</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 by Exposure */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Top 10 PIs by Exposure (€M)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topByExposure} layout="vertical" margin={{ left: 8, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={v => `€${v}M`} />
                <YAxis type="category" dataKey="ref" tick={{ fontSize: 11, fill: "#374151", fontFamily: "monospace" }} width={50} />
                <Tooltip formatter={(v: number) => [`€${v.toFixed(1)}M`, "Exposure"]} />
                <Bar dataKey="penaltyExposureM" radius={[0, 4, 4, 0]}>
                  {topByExposure.map((entry, i) => (
                    <Cell key={i} fill={entry.status === "At Risk" ? (entry.worstRAG === "RED" ? "#dc2626" : "#d97706") : "#9ca3af"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full PI Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">All 27 Performance Incentives</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#003A70] text-white">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">PI Ref</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Description</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">Mechanism</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">Linked DOs</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">Worst RAG</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide whitespace-nowrap">Exposure (€M)</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {performanceIndicators.map(pi => {
                const mechConf = MECHANISM_CONFIG[pi.mechanism];
                const MechIcon = mechConf.icon;
                return (
                  <tr key={pi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#003A70] text-xs whitespace-nowrap">{pi.ref}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs max-w-sm">
                      <span className="line-clamp-2">{pi.description}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded border font-medium ${mechConf.bg}`}>
                        <MechIcon className={`w-3 h-3 ${mechConf.color}`} />
                        {mechConf.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {pi.linkedDOs.map(doRef => (
                          <span key={doRef} className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{doRef}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><RAGBadge status={pi.worstRAG} size="sm" /></td>
                    <td className={`px-4 py-3 text-right text-sm font-bold whitespace-nowrap ${pi.penaltyExposureM > 10 ? "text-red-700" : pi.penaltyExposureM > 0 ? "text-amber-700" : "text-gray-400"}`}>
                      {pi.penaltyExposureM > 0 ? `€${pi.penaltyExposureM.toFixed(1)}M` : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${STATUS_CONFIG[pi.status]}`}>{pi.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
