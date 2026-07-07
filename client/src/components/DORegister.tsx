import React, { useState, useMemo } from "react";
import { deliveryObligations, DeliveryObligation, RAGStatus } from "@/data/doData";
import { RAGBadge } from "./RAGBadge";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortKey = keyof DeliveryObligation;
type SortDir = "asc" | "desc";

const CATEGORIES = ["All", ...Array.from(new Set(deliveryObligations.map(d => d.category)))];
const RAG_OPTIONS: { value: string; label: string }[] = [
  { value: "All", label: "All Statuses" },
  { value: "RED", label: "RED" },
  { value: "AMBER", label: "AMBER" },
  { value: "GREEN", label: "GREEN" },
  { value: "COMPLETE", label: "COMPLETE" },
  { value: "NOT_STARTED", label: "NOT STARTED" },
];

export function DORegister() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ragFilter, setRagFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("ref");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = [...deliveryObligations];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(d =>
        d.ref.toLowerCase().includes(q) ||
        d.subProgramme.toLowerCase().includes(q) ||
        d.milestoneDescription.toLowerCase().includes(q) ||
        d.responsiblePM.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== "All") data = data.filter(d => d.category === categoryFilter);
    if (ragFilter !== "All") data = data.filter(d => d.rag === ragFilter);
    data.sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [search, categoryFilter, ragFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 text-gray-300" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-[#003A70]" /> : <ChevronDown className="w-3 h-3 text-[#003A70]" />;
  }

  const totalPenalty = filtered.filter(d => d.rag === "AMBER" || d.rag === "RED").reduce((s, d) => s + d.penaltyExposureM, 0);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#003A70]">DO Register</h1>
        <p className="text-gray-500 text-sm mt-1">All 37 Delivery Obligations — filter, sort, and inspect</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by ref, programme, description, PM..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-52 text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={ragFilter} onValueChange={setRagFilter}>
          <SelectTrigger className="w-44 text-sm">
            <SelectValue placeholder="RAG Status" />
          </SelectTrigger>
          <SelectContent>
            {RAG_OPTIONS.map((o: { value: string; label: string }) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-500 ml-auto">
          <span className="font-semibold text-gray-700">{filtered.length}</span> of {deliveryObligations.length} DOs
          {totalPenalty > 0 && (
            <span className="ml-3 text-red-600 font-semibold">€{totalPenalty.toFixed(1)}M at risk</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#003A70] text-white">
                <Th col="ref" label="Ref" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="category" label="Category" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="subProgramme" label="Programme" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="obligationType" label="Type" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="allowanceM" label="Allowance (€M)" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="baselineDate" label="Baseline Date" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="forecastDate" label="Forecast Date" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="rag" label="RAG" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="penaltyExposureM" label="Penalty (€M)" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
                <Th col="responsiblePM" label="PM" onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((d) => {
                const isOverdue = d.forecastDate > d.baselineDate;
                const isExpanded = expandedId === d.id;
                return (
                  <React.Fragment key={d.id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : d.id)}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-[#003A70] text-xs whitespace-nowrap">{d.ref}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{d.category}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium max-w-xs">
                        <span className="line-clamp-2 text-xs">{d.subProgramme}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{d.obligationType}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700 text-xs whitespace-nowrap">
                        {d.allowanceM > 0 ? `€${d.allowanceM.toFixed(1)}M` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{d.baselineDate}</td>
                      <td className={`px-4 py-3 text-xs whitespace-nowrap font-semibold ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                        {d.forecastDate}
                        {isOverdue && <span className="ml-1 text-red-500">▲</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><RAGBadge status={d.rag} size="sm" /></td>
                      <td className={`px-4 py-3 text-right text-xs font-bold whitespace-nowrap ${d.penaltyExposureM > 0 && (d.rag === "RED" || d.rag === "AMBER") ? "text-red-600" : "text-gray-400"}`}>
                        {d.penaltyExposureM > 0 ? `€${d.penaltyExposureM.toFixed(1)}M` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{d.responsiblePM}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-blue-50/40">
                        <td colSpan={10} className="px-6 py-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Milestone Description</p>
                              <p className="text-sm text-gray-800">{d.milestoneDescription}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">PMO Notes</p>
                              <p className="text-sm text-gray-700 italic">{d.notes}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">PI Reference</p>
                              <p className="text-sm font-mono text-[#003A70] font-bold">{d.piRef}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Obligation Type</p>
                              <p className="text-sm text-gray-700">{d.obligationType}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No Delivery Obligations match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ col, label, onSort, sortKey, sortDir }: {
  col: SortKey; label: string; onSort: (k: SortKey) => void; sortKey: SortKey; sortDir: SortDir;
}) {
  const isActive = sortKey === col;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide cursor-pointer select-none hover:bg-white/10 whitespace-nowrap"
      onClick={() => onSort(col)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ChevronsUpDown className="w-3 h-3 opacity-40" />}
      </div>
    </th>
  );
}

