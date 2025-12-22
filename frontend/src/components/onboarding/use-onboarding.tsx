"use client";

import { useEffect, useState } from "react";
import { useOnborda } from "onborda";
import { ONBOARDING_STORAGE_KEY, ONBOARDING_DELAY_MS } from "@/lib/constants/onboarding";

interface OnboardingOptions {
  autoStart?: boolean;
}

export function useOnboarding({ autoStart = false }: OnboardingOptions = {}) {
  const { startOnborda } = useOnborda();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!autoStart || typeof window === "undefined") return;

    const status = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (status !== "completed") {
      const timer = setTimeout(() => setShowWelcome(true), ONBOARDING_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  const restartTour = () => setShowWelcome(true);

  const startTour = () => {
    setShowWelcome(false);
    setTimeout(() => startOnborda?.("dashboard"), 300);
  };

  const closeTour = (markComplete = autoStart) => {
    setShowWelcome(false);
    if (markComplete) {
      try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, "completed");
      } catch {
        // ignore localStorage errors in private browsing mode
      }
    }
  };

  return { showWelcome, restartTour, startTour, closeTour };
}
