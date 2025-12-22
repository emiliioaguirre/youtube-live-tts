"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean | undefined {
    const [matches, setMatches] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQuery.addEventListener("change", handler);
        return () => {
            mediaQuery.removeEventListener("change", handler);
        };
    }, [query]);

    return matches;
}

export function useIsDesktop(): boolean | undefined {
    return useMediaQuery("(min-width: 1024px)");
}

export function useIsMobile(): boolean {
    const isMobile = useMediaQuery("(max-width: 767px)");
    return !!isMobile;
}
