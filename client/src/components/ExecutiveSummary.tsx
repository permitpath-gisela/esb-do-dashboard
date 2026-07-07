import React from "react";
import { deliveryObligations, getSummaryStats, RAGStatus } from "@/data/doData";
import { RAGBadge } from "./RAGBadge";
import { AlertTriangle, CheckCircle2, Circle, XCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const RAG_COLORS: Record<RAGStatus, string> = {
  GREEN: "#16a34a",
  AMBER: "#d97706",
  RED: "#dc2626",
  COMPLETE: "#2563eb",
  NOT_STARTED: "#9ca3af",
};

const CATEGORY_ORDER = [
  "HV Reinforcement",
  "Asset Renewal",
  "Smart Metering",
  "EV & Heat Pump",
  "Renewable Connections",
  "New Connections",
  "Digital & IT",
  "Safety & Environment",
  "Workforce & Capability",
  "Network Resilience",
  "Customer Experience",
  "Regulatory Compliance",
];

export function ExecutiveSummary() {
  const stats = getSummaryStats(deliveryObligations);

  // Pie chart data
  const pieData = [
    { name: "GREEN", value: stats.green, color: RAG_COLORS.GREEN },
    { name: "AMBER", value: stats.amber, color: RAG_COLORS.AMBER },
    { name: "RED", value: stats.red, color: RAG_COLORS.RED },
    { name: "COMPLETE", value: stats.complete, color: RAG_COLORS.COMPLETE },
    { name: "NOT STARTED", value: stats.notStarted, color: RAG_COLORS.NOT_STARTED },
  ].filter(d => d.value > 0);

  // Heatmap data: category × RAG
  const heatmapData = CATEGORY_ORDER.map(cat => {
    const catDOs = deliveryObligations.filter(d => d.category === cat);
    return {
      category: cat,
      GREEN: catDOs.filter(d => d.rag === "GREEN").length,
      AMBER: catDOs.filter(d => d.rag === "AMBER").length,
      RED: catDOs.filter(d => d.rag === "RED").length,
      COMPLETE: catDOs.filter(d => d.rag === "COMPLETE").length,
      NOT_STARTED: catDOs.filter(d => d.rag === "NOT_STARTED").length,
      penaltyAtRisk: catDOs.filter(d => d.rag === "AMBER" || d.rag === "RED").reduce((s, d) => s + d.penaltyExposureM, 0),
    };
  }).filter(d => d.GREEN + d.AMBER + d.RED + d.COMPLETE + d.NOT_STARTED > 0);

  // Top critical DOs
  const criticalDOs = deliveryObligations
    .filter(d => d.rag === "RED" || d.rag === "AMBER")
    .sort((a, b) => {
      if (a.rag === "RED" && b.rag !== "RED") return -1;
      if (b.rag === "RED" && a.rag !== "RED") return 1;
      return b.penaltyExposureM - a.penaltyExposureM;
    })
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#003A70]">Executive Summary</h1>
        <p className="text-gray-500 text-sm mt-1">Delivery Obligation scorecard — PR6 period 2026–2030</p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-5 gap-4">
        <KPITile label="Total DOs" value={stats.total} icon={<Circle className="w-5 h-5 text-gray-400" />} bg="bg-gray-50" border="border-gray-200" />
        <KPITile label="On Track" value={stats.green} icon={<CheckCircle2 className="w-5 h-5 text-green-600" />} bg="bg-green-50" border="border-green-200" valueColor="text-green-700" />
        <KPITile label="At Risk" value={stats.amber} icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} bg="bg-amber-50" border="border-amber-200" valueColor="text-amber-700" />
        <KPITile label="Critical" value={stats.red} icon={<XCircle className="w-5 h-5 text-red-600" />} bg="bg-red-50" border="border-red-200" valueColor="text-red-700" />
        <KPITile
          label="Penalty Exposure"
          value={`€${stats.totalPenaltyAtRisk.toFixed(1)}M`}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          bg="bg-red-50"
          border="border-red-200"
          valueColor="text-red-700"
          isLarge
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">RAG Distribution</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} DOs`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-gray-600">{d.name}: <strong>{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Penalty Heatmap Bar Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Penalty Exposure by Category (€M)</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmapData} layout="vertical" margin={{ left: 8, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={v => `€${v}M`} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "#374151" }} width={130} />
                <Tooltip formatter={(value: number) => [`€${value.toFixed(1)}M`, "Penalty at Risk"]} />
                <Bar dataKey="penaltyAtRisk" radius={[0, 4, 4, 0]}>
                  {heatmapData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.RED > 0 ? "#dc2626" : entry.AMBER > 0 ? "#d97706" : "#16a34a"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Critical DOs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Top 5 Critical Delivery Obligations — Requires Immediate Attention</h3>
          <span className="text-xs text-gray-400">Sorted by RAG severity then penalty exposure</span>
        </div>
        <div className="divide-y divide-gray-50">
          {criticalDOs.map((d, i) => {
            const isOverdue = d.forecastDate > d.baselineDate;
            const baseDate = new Date(d.baselineDate);
            const forecastDate = new Date(d.forecastDate);
            const diffDays = Math.round((forecastDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={d.id} className="px-5 py-4 flex items-start gap-4">
                <span className="text-xs font-bold text-gray-400 w-4 mt-1">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#003A70]">{d.ref}</span>
                    <RAGBadge status={d.rag} size="sm" />
                    <span className="text-xs text-gray-500 truncate">{d.subProgramme}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">{d.milestoneDescription}</p>
                  <p className="text-xs text-gray-400 mt-1 italic">{d.notes}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Baseline:</span> {d.baselineDate}
                  </div>
                  <div className={`text-xs ${isOverdue ? "text-red-600 font-semibold" : "text-green-600"}`}>
                    <span className="font-semibold">Forecast:</span> {d.forecastDate}
                    {isOverdue && ` (+${diffDays}d)`}
                  </div>
                  <div className="text-xs font-bold text-red-700">€{d.penaltyExposureM.toFixed(1)}M at risk</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PMO Performance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricTile label="PMIS Data Quality" value="87%" target="≥85%" status="GREEN" />
        <MetricTile label="Stage Gate Pass Rate" value="91%" target="≥90%" status="GREEN" />
        <MetricTile label="DO Milestone Adherence" value="78%" target="≥95%" status="RED" />
        <MetricTile label="CRs Processed on Time" value="94%" target="≥90%" status="GREEN" />
      </div>
    </div>
  );
}

function KPITile({ label, value, icon, bg, border, valueColor = "text-gray-800", isLarge = false }: {
  label: string; value: string | number; icon: React.ReactNode; bg: string; border: string; valueColor?: string; isLarge?: boolean;
}) {
  return (
    <div className={`${bg} border ${border} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className={`font-bold ${isLarge ? "text-2xl" : "text-3xl"} ${valueColor}`}>{value}</p>
    </div>
  );
}

function MetricTile({ label, value, target, status }: { label: string; value: string; target: string; status: RAGStatus }) {
  const color = status === "GREEN" ? "text-green-700" : status === "AMBER" ? "text-amber-700" : "text-red-700";
  const bg = status === "GREEN" ? "bg-green-50 border-green-200" : status === "AMBER" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";
  return (
    <div className={`border rounded-xl p-4 ${bg}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">Target: {target}</p>
    </div>
  );
}
