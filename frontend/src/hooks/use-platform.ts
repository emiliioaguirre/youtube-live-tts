"use client";

import { useState } from "react";

export function useIsMac() {
  const [isMac] = useState(
    () =>
      typeof navigator !== "undefined" &&
      navigator.platform.toUpperCase().indexOf("MAC") >= 0
  );
  return isMac;
}
