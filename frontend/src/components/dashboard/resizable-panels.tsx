"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let percentage = (x / rect.width) * 100;

      // Snap to center (50%) when within 3% range
      if (Math.abs(percentage - 50) < 3) {
        percentage = 50;
      }

      const clampedPercentage = Math.min(
        Math.max(percentage, minLeftWidth),
        maxLeftWidth
      );
      setLeftWidth(clampedPercentage);
    },
    [isDragging, minLeftWidth, maxLeftWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const rightWidth = 100 - leftWidth;

  return (
    <div
      ref={containerRef}
      className="flex flex-1 min-h-0 overflow-visible"
    >
      <div
        id="onboarding-left-panel"
        className="min-h-0 overflow-visible shrink-0"
        style={{ width: `calc(${leftWidth}% - 12px)` }}
      >
        {leftPanel}
      </div>

      <div
        className="w-6 shrink-0 flex items-center justify-center cursor-col-resize"
        onMouseDown={handleMouseDown}
      >
        <div
          className={cn(
            "w-0.5 h-12 rounded-full bg-border hover:bg-muted-foreground/50 transition-colors",
            isDragging && "bg-muted-foreground/50"
          )}
        />
      </div>

      <div
        id="onboarding-right-panel"
        className="min-h-0 overflow-visible shrink-0"
        style={{ width: `calc(${rightWidth}% - 12px)` }}
      >
        {rightPanel}
      </div>
    </div>
  );
}
