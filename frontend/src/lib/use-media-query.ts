"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean | undefined {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => undefined
  );
}

export function useIsDesktop(): boolean | undefined {
    return useMediaQuery("(min-width: 1024px)");
}

export function useIsMobile(): boolean {
    const isMobile = useMediaQuery("(max-width: 767px)");
    return !!isMobile;
}
