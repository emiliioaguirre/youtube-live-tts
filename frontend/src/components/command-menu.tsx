"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Moon,
  Sun,
  Play,
  CircleStop,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useDashboardStore } from "@/store/dashboard-store";
import { useTranslation } from "@/lib/i18n";
import { useIsMac } from "@/hooks/use-platform";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const isMac = useIsMac();
  const mod = isMac ? "⌘" : "Ctrl+";
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { status, startBot, stopBot, config } = useDashboardStore();
  const { t } = useTranslation();
  const isConfigured = !!(config.elevenlabs_api_key && config.video_id);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      // Cmd+1 for Dashboard
      if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/");
        setOpen(false);
      }

      // Cmd+Shift+D for toggle theme
      if (e.key === "d" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setTheme(theme === "light" ? "dark" : "light");
      }

      // Cmd+E for start/stop bot
      if (e.key === "e" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
        if (status.running) {
          stopBot();
        } else if (isConfigured) {
          startBot();
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router, setTheme, theme, status.running, isConfigured, startBot, stopBot]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t("searchPlaceholder")} />
      <CommandList>
        <CommandEmpty>{t("noResults")}</CommandEmpty>

        <CommandGroup heading={t("navigation")}>
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>{t("dashboard")}</span>
            <CommandShortcut>{mod}1</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t("bot")}>
          {status.running ? (
            <CommandItem
              onSelect={() => runCommand(() => stopBot())}
            >
              <CircleStop className="mr-2 h-4 w-4" />
              <span>{t("stopBot")}</span>
              <CommandShortcut>{mod}E</CommandShortcut>
            </CommandItem>
          ) : (
            <CommandItem
              onSelect={() => runCommand(() => startBot())}
              disabled={!isConfigured}
            >
              <Play className="mr-2 h-4 w-4" />
              <span>{t("startBot")}</span>
              <CommandShortcut>{mod}E</CommandShortcut>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t("theme")}>
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>{t("lightMode")}</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>{t("darkMode")}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
