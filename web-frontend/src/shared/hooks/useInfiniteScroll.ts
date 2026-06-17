"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Triggers `callback` when the sentinel element enters the viewport.
 * Attach the returned `ref` to a sentinel div at the bottom of a list.
 *
 * @param callback  - Called when the sentinel becomes visible
 * @param threshold - Intersection threshold (0–1, default: 0.1)
 * @param enabled   - Set to false to pause observation (e.g. while loading)
 */
export function useInfiniteScroll(
  callback: () => void,
  threshold: number = 0.1,
  enabled: boolean = true
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const stableCallback = useRef(callback);

  // Keep callback ref up-to-date without re-creating the observer
  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          stableCallback.current();
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, enabled]);

  return { ref };
}
