"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useOnborda } from "onborda";
import type { CardComponentProps } from "onborda";
import confetti from "canvas-confetti";

const CONFETTI_COLORS = ["#E53935", "#FF5252", "#C62828", "#FF8A80", "#D32F2F"];

const ONBOARDING_VIDEOS = [
  "/videos/onboarding1.mp4",
  "/videos/onboarding2.mp4",
  "/videos/onboarding3.mp4",
  "/videos/onboarding4.mp4",
  "/videos/onboarding5.mp4",
  "/videos/onboarding6.mp4",
  "/videos/onboarding7.mp4",
  "/videos/onboarding8.mp4",
  "/videos/onboarding9.mp4",
];

function OnboardingVideo({ index }: { index: number }) {
  return (
    <video
      src={ONBOARDING_VIDEOS[index] || ONBOARDING_VIDEOS[0]}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-auto rounded-lg"
    />
  );
}

const triggerConfetti = (event: React.MouseEvent<HTMLButtonElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    },
    colors: CONFETTI_COLORS,
  });
};

export function OnboardingCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}: CardComponentProps) {
  const { t } = useTranslation();
  const { closeOnborda } = useOnborda();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  useEffect(() => {
    if (!step?.selector) return;

    const timer = setTimeout(() => {
      const element = document.querySelector(step.selector);
      if (!element) return;

      const focusable = element.querySelector('input:not([type="hidden"]), textarea');
      if (focusable instanceof HTMLElement) {
        focusable.focus({ preventScroll: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [step?.selector, currentStep]);

  const handleClose = () => {
    try {
      localStorage.setItem("youtube-tts-onboarding-status", "completed");
    } catch {
      // ignore localStorage errors in private browsing mode
    }
    closeOnborda();
  };

  const handleFinish = (event: React.MouseEvent<HTMLButtonElement>) => {
    triggerConfetti(event);
    handleClose();
  };

  const handleSkip = () => {
    try {
      localStorage.setItem("youtube-tts-onboarding-status", "skipped");
    } catch {
      // ignore localStorage errors in private browsing mode
    }
    closeOnborda();
  };

  return (
    <motion.div
      className="relative w-[320px] max-w-[90vw]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {arrow}

      <div className={cn(
        "rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-2xl overflow-hidden",
        isLastStep && "-translate-x-12"
      )}>
        <div className="flex items-start justify-between p-4 pb-2">
          <h3 className="text-base font-medium text-foreground pr-8">
            {step.title}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            aria-label="Close tour"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="text-sm text-muted-foreground px-4 pb-3 leading-relaxed">
          {step.content}
        </div>

        <div className="mx-4 mb-4 flex items-center rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <OnboardingVideo index={currentStep} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {currentStep + 1} of {totalSteps}
          </span>

          <div className="flex items-center gap-2">
            {isFirstStep ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="h-8 text-muted-foreground"
              >
                {t("onboardingSkip")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                className="h-8"
              >
                {t("onboardingBack")}
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={isLastStep ? handleFinish : nextStep}
              className="h-8"
            >
              {isLastStep ? t("onboardingFinish") : t("onboardingContinue")}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
