"use client";

import { useState, useEffect, useRef } from "react";
import {
  Settings,
  Key,
  Link as LinkIcon,
  Volume2,
  Mic,
  Loader2,
  CircleCheck,
  XCircle,
  MessageSquareText,
  Gauge,
  Timer,
  FileText,
  ExternalLink,
  AudioLines,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useDashboardStore, type TtsProvider } from "@/store/dashboard-store";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SettingsCard() {
  const { config, setConfig, status, hasSixtydbKey } = useDashboardStore();
  const { t } = useTranslation();
  const [validating, setValidating] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const apiKeyDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const apiKey = config.elevenlabs_api_key?.trim();

    if (apiKeyDebounceRef.current) {
      clearTimeout(apiKeyDebounceRef.current);
    }

    // If empty or too short, save but don't validate
    if (!apiKey || apiKey.length < 20) {
      setApiKeyValid(null);
      apiKeyDebounceRef.current = setTimeout(() => {
        useDashboardStore.getState().saveConfig();
      }, 800);
      return;
    }

    apiKeyDebounceRef.current = setTimeout(async () => {
      setValidating(true);
      try {
        const result = await useDashboardStore.getState().saveConfig();
        if (result.api_key_valid !== null) {
          setApiKeyValid(result.api_key_valid);
          if (!result.api_key_valid) {
            toast.error(t("invalidApiKey"));
          }
        }
      } catch {
        // ignore network errors
      } finally {
        setValidating(false);
      }
    }, 800);

    return () => {
      if (apiKeyDebounceRef.current) {
        clearTimeout(apiKeyDebounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.elevenlabs_api_key]);

  useEffect(() => {
    if (autoSaveDebounceRef.current) {
      clearTimeout(autoSaveDebounceRef.current);
    }

    autoSaveDebounceRef.current = setTimeout(() => {
      useDashboardStore.getState().saveConfig();
    }, 800);

    return () => {
      if (autoSaveDebounceRef.current) {
        clearTimeout(autoSaveDebounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.tts_provider,
    config.video_id,
    config.voice_id,
    config.tts_prefix,
    config.tts_template,
    config.volume,
    config.speed,
    config.cooldown_seconds,
  ]);

  return (
    <div id="onboarding-settings-card" className="relative rounded-xl border border-border bg-card p-6 h-full overflow-y-auto">
      <div className="mb-6 flex items-center gap-2">
        <Settings className="size-4 text-muted-foreground" />
        <h2 className="text-[15px] font-normal text-foreground tracking-[-0.45px]">
          {t("configuration")}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <AudioLines className="size-3.5" />
            {t("ttsProvider")}
          </Label>
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/30 p-1">
            {(["elevenlabs", "60db"] as TtsProvider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setConfig({ tts_provider: p })}
                disabled={status.running}
                aria-pressed={config.tts_provider === p}
                className={cn(
                  "h-8 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  config.tts_provider === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p === "elevenlabs" ? t("providerElevenLabs") : t("providerSixtyDb")}
              </button>
            ))}
          </div>
        </div>

        {config.tts_provider === "elevenlabs" && (
          <div id="onboarding-api-key" className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Key className="size-3.5" />
                {t("elevenLabsApiKey")}
              </Label>
              <a
                href="https://elevenlabs.io/app/developers/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("getApiKey")}
                <ExternalLink className="size-3" />
              </a>
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="sk_..."
                value={config.elevenlabs_api_key}
                onChange={(e) => {
                  setConfig({ elevenlabs_api_key: e.target.value });
                  setApiKeyValid(null);
                }}
                disabled={status.running}
                aria-label="ElevenLabs API Key"
                aria-describedby="api-key-status"
                className={cn(
                  "h-9 pr-9",
                  apiKeyValid === true && "border-green-500 focus-visible:ring-green-500",
                  apiKeyValid === false && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validating && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                {!validating && apiKeyValid === true && <CircleCheck className="size-4 text-green-500" />}
                {!validating && apiKeyValid === false && <XCircle className="size-4 text-red-500" />}
              </div>
            </div>
          </div>
        )}

        {config.tts_provider === "60db" && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Key className="size-3.5" />
              {t("providerSixtyDb")}
            </Label>
            <div
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 text-xs",
                hasSixtydbKey
                  ? "border-green-500/40 text-green-600 dark:text-green-500"
                  : "border-amber-500/40 text-amber-600 dark:text-amber-500"
              )}
            >
              {hasSixtydbKey ? (
                <CircleCheck className="size-4 shrink-0" />
              ) : (
                <AlertCircle className="size-4 shrink-0" />
              )}
              <span>
                {hasSixtydbKey ? t("sixtydbKeyConfigured") : t("sixtydbKeyMissing")}
              </span>
            </div>
          </div>
        )}

        <div id="onboarding-video-url" className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <LinkIcon className="size-3.5" />
            {t("youtubeVideoId")}
          </Label>
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={config.video_id}
            onChange={(e) => setConfig({ video_id: e.target.value })}
            disabled={status.running}
            aria-label="YouTube Video ID or URL"
            className="h-9"
          />
        </div>

        <div id="onboarding-voice-id" className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <Mic className="size-3.5" />
            {t("voiceId")}
          </Label>
          <Input
            placeholder={
              config.tts_provider === "60db"
                ? t("sixtydbVoicePlaceholder")
                : "Voice ID from ElevenLabs"
            }
            value={config.voice_id}
            onChange={(e) => setConfig({ voice_id: e.target.value })}
            disabled={status.running}
            aria-label="Voice ID"
            className="h-9"
          />
        </div>

        <div id="onboarding-tts-prefix" className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <MessageSquareText className="size-3.5" />
            {t("ttsPrefix")}
          </Label>
          <Input
            placeholder="!tts"
            value={config.tts_prefix}
            onChange={(e) => setConfig({ tts_prefix: e.target.value })}
            disabled={status.running}
            aria-label="TTS trigger prefix"
            className="h-9"
          />
        </div>

        <div id="onboarding-tts-template" className="space-y-2">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="size-3.5" />
            {t("ttsTemplate")}
          </Label>
          <Input
            placeholder={t("ttsTemplatePlaceholder")}
            value={config.tts_template}
            onChange={(e) => setConfig({ tts_template: e.target.value })}
            disabled={status.running}
            aria-label="TTS message template"
            aria-describedby="tts-template-hint"
            className="h-9"
          />
          <p id="tts-template-hint" className="text-xs text-muted-foreground">
            {t("ttsTemplateHint")}
          </p>
        </div>

        <div id="onboarding-audio-settings" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Volume2 className="size-3.5" />
              {t("volume")}: {Math.round(config.volume * 100)}%
            </Label>
            <Slider
              value={[config.volume]}
              onValueChange={(v) => setConfig({ volume: v[0] })}
              min={0}
              max={1}
              step={0.05}
              disabled={status.running}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Gauge className="size-3.5" />
              {t("speed")}: {config.speed.toFixed(2)}x
            </Label>
            <Slider
              value={[config.speed]}
              onValueChange={(v) => setConfig({ speed: v[0] })}
              min={0.5}
              max={1.5}
              step={0.05}
              disabled={status.running}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Timer className="size-3.5" />
              {t("cooldown")}: {config.cooldown_seconds}s
            </Label>
            <Slider
              value={[config.cooldown_seconds]}
              onValueChange={(v) => setConfig({ cooldown_seconds: v[0] })}
              min={0}
              max={30}
              step={1}
              disabled={status.running}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
