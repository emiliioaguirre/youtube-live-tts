"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAccentColorStore, AccentColor, ACCENT_COLOR_NAMES } from "@/lib/accent-color";
import { useTranslation, useLanguageStore } from "@/lib/i18n";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccentColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS: { id: AccentColor; lightClass: string; darkClass: string }[] = [
  { id: "red", lightClass: "bg-red-500", darkClass: "dark:bg-red-500" },
  { id: "rose", lightClass: "bg-rose-500", darkClass: "dark:bg-rose-500" },
  { id: "orange", lightClass: "bg-orange-500", darkClass: "dark:bg-orange-500" },
  { id: "green", lightClass: "bg-green-500", darkClass: "dark:bg-green-500" },
  { id: "blue", lightClass: "bg-blue-500", darkClass: "dark:bg-blue-500" },
  { id: "yellow", lightClass: "bg-yellow-500", darkClass: "dark:bg-yellow-500" },
  { id: "purple", lightClass: "bg-purple-500", darkClass: "dark:bg-purple-500" },
];

export function AccentColorDialog({ open, onOpenChange }: AccentColorDialogProps) {
  const { accentColor, setAccentColor } = useAccentColorStore();
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const handleSelect = (color: AccentColor) => {
    setAccentColor(color);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("appearance")}</DialogTitle>
          <DialogDescription>{t("appearanceDescription")}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-3 py-4">
          {COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => handleSelect(color.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                accentColor === color.id
                  ? "border-foreground"
                  : "border-transparent hover:border-muted-foreground/50"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-full flex items-center justify-center shadow-sm",
                  color.lightClass,
                  color.darkClass
                )}
              >
                {accentColor === color.id && (
                  <Check className="size-4 text-white drop-shadow-sm" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {ACCENT_COLOR_NAMES[color.id][language]}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
