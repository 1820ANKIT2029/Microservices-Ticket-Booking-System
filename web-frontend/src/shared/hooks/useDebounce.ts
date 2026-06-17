"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Delays updating a value until it hasn't changed for `delay` milliseconds.
 * Use this to debounce search inputs, filter changes, etc.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
