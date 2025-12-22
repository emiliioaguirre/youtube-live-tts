"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/lib/i18n";
import { YouTubeLogo } from "@/components/ui/youtube-logo";

interface WelcomeDialogProps {
  open: boolean;
  onNext: () => void;
  onClose: () => void;
}

export function WelcomeDialog({ open, onNext, onClose }: WelcomeDialogProps) {
  const { language } = useLanguageStore();
  const isEnglish = language === "en";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm font-sans">
        {/* Visual icon */}
        <div className="flex justify-center pt-8 pb-6">
          <div className="flex items-center justify-center size-16 rounded-xl border bg-card shadow-sm">
            <YouTubeLogo className="size-8" />
          </div>
        </div>

        <DialogHeader className="items-center text-center space-y-4 px-2">
          <DialogTitle className="text-xl font-medium">
            {isEnglish
              ? "Welcome to YouTube Live TTS!"
              : "¡Bienvenido a YouTube Live TTS!"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground leading-relaxed">
            {isEnglish
              ? "Let your chat speak for itself. Engage your audience with real time, human like voices powered by ElevenLabs."
              : "Deja que tu chat hable por sí solo. Conecta con tu audiencia usando voces humanas en tiempo real con ElevenLabs."}
          </DialogDescription>
        </DialogHeader>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 pt-8 pb-6">
          <Button onClick={onNext} className="w-full">
            {isEnglish ? "Start Tour" : "Comenzar Tour"}
          </Button>
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isEnglish ? "Not now" : "Ahora no"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
