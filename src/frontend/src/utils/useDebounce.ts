import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search bar input).
 * @param value The value to debounce.
 * @param delay Delay in milliseconds (default: 400ms).
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
