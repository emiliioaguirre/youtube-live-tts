"use client";

import { useState } from "react";
import { Play, CircleStop, Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDashboardStore } from "@/store/dashboard-store";
import { useTranslation } from "@/lib/i18n";
import { TranslationKey } from "@/lib/i18n/translations";
import { toast } from "sonner";
import Link from "next/link";

interface DashboardHeaderProps {
  titleKey?: TranslationKey;
}

export function DashboardHeader({ titleKey = "dashboard" }: DashboardHeaderProps) {
  const { status, startBot, stopBot, config } = useDashboardStore();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const isConfigured = !!(config.elevenlabs_api_key && config.video_id);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await startBot();
      toast.success(t("botStarted"));
    } catch {
      toast.error(t("failedToStart"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      await stopBot();
      toast.info(t("botStopped"));
    } catch {
      toast.error(t("failedToStop"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-3 py-2.5 sm:px-4 sm:py-3 md:px-7">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <SidebarTrigger className="shrink-0" />
        <h1 className="text-base sm:text-xl md:text-2xl font-medium text-foreground truncate">
          {t(titleKey)}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
        <Button
          id="onboarding-control-button"
          variant="default"
          size="sm"
          className={status.running ? "gap-2 bg-red-500 hover:bg-red-600 text-white" : "gap-2"}
          onClick={status.running ? handleStop : handleStart}
          disabled={isLoading || (status.running ? false : !isConfigured)}
          aria-label={status.running ? "Stop TTS bot" : "Start TTS bot"}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span className="hidden sm:inline">
                {status.running ? t("stop") : t("start")}...
              </span>
            </>
          ) : status.running ? (
            <>
              <CircleStop className="size-4" />
              <span className="hidden sm:inline">{t("stop")}</span>
            </>
          ) : (
            <>
              <Play className="size-4" />
              <span className="hidden sm:inline">{t("start")}</span>
            </>
          )}
        </Button>
        <Button variant="ghost" size="icon" className="size-8 shrink-0" asChild>
          <Link
            href="https://github.com/emiliioaguirre/youtube-live-tts"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            <Github className="size-4" />
          </Link>
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
