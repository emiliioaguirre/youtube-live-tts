"use client";

import { MessageSquare, ListOrdered, Radio, Wifi, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { TranslationKey } from "@/lib/i18n/translations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NumberFlow from "@number-flow/react";

const iconMap = {
  messages: MessageSquare,
  queue: ListOrdered,
  bot: Radio,
  youtube: Wifi,
};

const titleKeyMap: Record<string, TranslationKey> = {
  messages: "messagesRead",
  queue: "inQueue",
  bot: "botStatus",
  youtube: "youtubeChat",
};

const tooltipKeyMap: Record<string, TranslationKey> = {
  messages: "messagesTooltip",
  queue: "queueTooltip",
  bot: "botTooltip",
  youtube: "youtubeTooltip",
};

const valueKeyMap: Record<string, TranslationKey> = {
  Running: "running",
  Stopped: "stopped",
  Connected: "connected",
  Disconnected: "disconnected",
};

interface StatCardProps {
  value: string | number;
  icon: keyof typeof iconMap;
  status?: "active" | "inactive";
}

export function StatCard({ value, icon, status }: StatCardProps) {
  const { t } = useTranslation();
  const Icon = iconMap[icon];
  const title = t(titleKeyMap[icon]);
  const tooltip = t(tooltipKeyMap[icon]);
  const displayValue = typeof value === "string" && valueKeyMap[value]
    ? t(valueKeyMap[value])
    : value;

  return (
    <TooltipProvider>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-muted">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <span
              className={cn(
                "size-2 rounded-full",
                status === "active" ? "bg-green-500" : "bg-muted-foreground"
              )}
            />
          )}
          {typeof value === "number" ? (
            <NumberFlow
              value={value}
              className="text-2xl font-medium text-foreground"
            />
          ) : (
            <p className="text-2xl font-medium text-foreground">{displayValue}</p>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
