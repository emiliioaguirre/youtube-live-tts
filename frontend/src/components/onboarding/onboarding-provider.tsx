"use client";

import { useEffect } from "react";
import { Onborda, OnbordaProvider as OnbordaBase, useOnborda } from "onborda";
import { useLanguageStore } from "@/lib/i18n";
import { getDashboardTourSteps } from "./onboarding-steps";
import { OnboardingCard } from "./onboarding-card";

function OnbordaBodyClassManager() {
  const { currentStep, isOnbordaVisible } = useOnborda();

  const isActive = isOnbordaVisible && currentStep !== undefined && currentStep >= 0;

  useEffect(() => {
    if (isActive) {
      document.body.classList.add("onborda-active");
    } else {
      document.body.classList.remove("onborda-active");
    }

    return () => {
      document.body.classList.remove("onborda-active");
    };
  }, [isActive]);

  return null;
}

export function OnbordaProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();
  const steps = getDashboardTourSteps(language);

  return (
    <OnbordaBase>
      <Onborda
        steps={steps}
        cardComponent={OnboardingCard}
        cardTransition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        shadowRgb="0,0,0"
        shadowOpacity="0.7"
      >
        <div className="[&_[data-onborda-wrapper]]:z-[60]">
          <OnbordaBodyClassManager />
          {children}
        </div>
      </Onborda>
    </OnbordaBase>
  );
}
