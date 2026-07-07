import { useState } from "react";
import { Sidebar, TabId } from "@/components/Sidebar";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { DORegister } from "@/components/DORegister";
import { PILog } from "@/components/PILog";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("executive");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reportingPeriod="Q2 2026 (Apr–Jun)"
        lastUpdated="06 Jul 2026"
      />
      <main className="flex-1 overflow-auto">
        {activeTab === "executive" && <ExecutiveSummary />}
        {activeTab === "do-register" && <DORegister />}
        {activeTab === "pi-log" && <PILog />}
      </main>
    </div>
  );
}
