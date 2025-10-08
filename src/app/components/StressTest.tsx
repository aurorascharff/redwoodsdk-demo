"use client";

import { useEffect } from "react";
import { noOp } from "@/app/shared/functions";

export function StressTest() {
  useEffect(() => {
    let active = true;

    const runStressTest = () => {
      const interval = setInterval(() => {
        if (!active) {
          clearInterval(interval);
          return;
        }

        // Fire off a server action to trigger the middleware.
        // We don't await it because we want to fire them rapidly.
        noOp();
      }, 50); // Fire every 50ms for high frequency.

      return interval;
    };

    const intervalId = runStressTest();

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  // This component renders nothing.
  return null;
}
