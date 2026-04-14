"use client";

import { useIsMac } from "@/hooks/use-platform";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Settings,
  Languages,
  Check,
  GraduationCap,
  Sun,
  Moon,
  Monitor,
  Palette,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UpgradeCard } from "./upgrade-card";
import { YouTubeLogo } from "@/components/ui/youtube-logo";
import { useDashboardStore } from "@/store/dashboard-store";
import { useTranslation, useLanguageStore } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { TranslationKey } from "@/lib/i18n/translations";
import { useOnboarding } from "@/components/onboarding/use-onboarding";
import { WelcomeDialog } from "@/components/onboarding/welcome-dialog";

const navItems: { href: string; labelKey: TranslationKey; icon: typeof LayoutDashboard }[] = [
  { href: "/", labelKey: "dashboard", icon: LayoutDashboard },
];

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  showWelcome?: boolean;
  onWelcomeNext?: () => void;
  onWelcomeClose?: () => void;
}

export function DashboardSidebar({
  showWelcome: autoShowWelcome,
  onWelcomeNext: autoOnWelcomeNext,
  onWelcomeClose: autoOnWelcomeClose,
  ...props
}: DashboardSidebarProps) {
  const { status } = useDashboardStore();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useTheme();
  const { restartTour, showWelcome: manualShowWelcome, startTour: manualStartTour, closeTour: manualCloseTour } = useOnboarding();
  const pathname = usePathname();
  const isMac = useIsMac();

  const showWelcome = autoShowWelcome || manualShowWelcome;
  const onNext = manualShowWelcome ? manualStartTour : (autoOnWelcomeNext ?? manualStartTour);
  const onClose = manualShowWelcome ? manualCloseTour : (autoOnWelcomeClose ?? manualCloseTour);

  const openCommandMenu = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <>
      <WelcomeDialog open={showWelcome} onNext={onNext} onClose={onClose} />
      <Sidebar className="lg:border-r-0!" collapsible="offcanvas" {...props}>
        <SidebarHeader className="pb-0">
          <div className="px-2 py-3">
            <TooltipProvider>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-8 rounded-lg border bg-card shadow-sm">
                    <YouTubeLogo className="size-5" />
                  </div>
                  <span className="font-medium">YouTube Live TTS</span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        "size-2 rounded-full cursor-default",
                        status.running ? "bg-green-500" : "bg-muted-foreground"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {status.running ? t("live") : t("offline")}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <button
              onClick={openCommandMenu}
              className="mt-4 w-full flex items-center gap-2 rounded-md border border-border bg-background px-2.5 h-8 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Search className="size-4" />
              <span className="flex-1 text-left tracking-[-0.42px]">{t("search")}</span>
              <div className="flex items-center gap-0.5 rounded border border-border bg-sidebar px-1.5 py-0.5 shrink-0">
                <span className="text-[10px] font-medium text-muted-foreground leading-none tracking-[-0.1px]">
                  {isMac ? "⌘" : "Ctrl"}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground leading-none tracking-[-0.1px]">
                  K
                </span>
              </div>
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="h-7 text-sm text-muted-foreground"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="space-y-1 mb-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-7 text-sm text-muted-foreground">
                  <a href="https://github.com/emiliioaguirre/youtube-live-tts" target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="size-4" />
                    <span>{t("github")}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="h-7 text-sm text-muted-foreground">
                      <Settings className="size-4" />
                      <span>{t("settings")}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-48">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Languages className="size-4 mr-2" />
                        <span>{t("language")}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent sideOffset={10}>
                          <DropdownMenuItem onClick={() => setLanguage("en")}>
                            <span className="flex-1">English</span>
                            {language === "en" && <Check className="size-4 ml-2" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLanguage("es")}>
                            <span className="flex-1">Español</span>
                            {language === "es" && <Check className="size-4 ml-2" />}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Sun className="size-4 mr-2" />
                        <span>{t("theme")}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent sideOffset={10}>
                          <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="size-4 mr-2" />
                            <span className="flex-1">{t("lightMode")}</span>
                            {theme === "light" && <Check className="size-4 ml-2" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="size-4 mr-2" />
                            <span className="flex-1">{t("darkMode")}</span>
                            {theme === "dark" && <Check className="size-4 ml-2" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Monitor className="size-4 mr-2" />
                            <span className="flex-1">{t("systemMode")}</span>
                            {theme === "system" && <Check className="size-4 ml-2" />}
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={restartTour}>
                      <GraduationCap className="size-4 mr-2" />
                      <span>{t("onboardingStartTour")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          <UpgradeCard />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
