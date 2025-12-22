"use client";

import { StatCard } from "./stat-card";
import { SettingsCard } from "./settings-card";
import { MessagesCard } from "./messages-card";
import { ResizablePanels } from "./resizable-panels";
import { useDashboardStore } from "@/store/dashboard-store";
import { useIsDesktop } from "@/lib/use-media-query";

export function DashboardContent() {
  const { stats } = useDashboardStore();
  const isDesktop = useIsDesktop();

  return (
    <div className="w-full overflow-visible p-4 flex-1 min-h-0 flex flex-col relative">
      <div className="mx-auto w-full flex flex-col flex-1 min-h-0 gap-6">
        <div id="onboarding-stats-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              value={stat.value}
              icon={stat.icon}
              status={stat.status}
            />
          ))}
        </div>

        {isDesktop === undefined ? (
          <div className="flex-1 min-h-0" />
        ) : isDesktop ? (
          <ResizablePanels
            leftPanel={<SettingsCard />}
            rightPanel={<MessagesCard />}
            defaultLeftWidth={50}
            minLeftWidth={30}
            maxLeftWidth={70}
          />
        ) : (
          <div className="flex flex-col gap-6 flex-1 min-h-0 overflow-hidden">
            <SettingsCard />
            <MessagesCard />
          </div>
        )}
      </div>
    </div>
  );
}
