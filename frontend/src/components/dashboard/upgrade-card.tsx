"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";

export function UpgradeCard() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-3.5 text-foreground" />
          <span className="text-xs font-medium text-foreground">
            {t("upgradeTitle")}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("upgradeDescription")}
        </p>
        <p className="text-xs text-muted-foreground">{t("madeBy")} Emilio Aguirre</p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-full justify-center gap-1.5 text-xs"
          asChild
        >
          <Link
            href="https://github.com/emiliioaguirre/youtube-live-tts"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("viewOnGithub")}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
