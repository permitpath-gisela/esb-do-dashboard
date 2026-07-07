import { cn } from "@/lib/utils";
import { BarChart3, ClipboardList, ShieldAlert, LayoutDashboard } from "lucide-react";

export type TabId = "executive" | "do-register" | "pi-log";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  lastUpdated: string;
  reportingPeriod: string;
}

const navItems: { id: TabId; label: string; icon: React.ElementType; description: string }[] = [
  { id: "executive", label: "Executive Summary", icon: LayoutDashboard, description: "RAG overview & heatmap" },
  { id: "do-register", label: "DO Register", icon: ClipboardList, description: "All 37 obligations" },
  { id: "pi-log", label: "PI Exposure Log", icon: ShieldAlert, description: "Penalty risk summary" },
];

export function Sidebar({ activeTab, onTabChange, lastUpdated, reportingPeriod }: SidebarProps) {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#003A70] flex flex-col min-h-screen">
      {/* Logo / Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 bg-[#007A3D] rounded flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">ESB Networks</p>
            <p className="text-white/60 text-xs leading-tight">PR6 Dashboard</p>
          </div>
        </div>
      </div>

      {/* Reporting Context */}
      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-2">Reporting Period</p>
        <p className="text-white text-sm font-semibold">{reportingPeriod}</p>
        <p className="text-white/50 text-xs mt-1">Updated: {lastUpdated}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-white/40 text-xs uppercase tracking-widest font-semibold px-2 mb-3">Views</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90"
              )}
            >
              <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isActive ? "text-[#4ADE80]" : "text-white/40")} />
              <div>
                <p className={cn("text-sm font-semibold leading-tight", isActive ? "text-white" : "text-white/70")}>
                  {item.label}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{item.description}</p>
              </div>
              {isActive && (
                <div className="ml-auto w-1 h-full min-h-[20px] bg-[#007A3D] rounded-full flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs">AIMF Framework v1.0</p>
        <p className="text-white/30 text-xs">CRU PR6 Determination 2025</p>
      </div>
    </aside>
  );
}
