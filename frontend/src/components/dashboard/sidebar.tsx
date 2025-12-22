"use client";

import { useIsMac } from "@/hooks/use-platform";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Github,
  Settings,
  Languages,
  Check,
  GraduationCap,
  Sun,
  Moon,
  Monitor,
  Palette,
} from "lucide-react";
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
                    <Github className="size-4" />
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
