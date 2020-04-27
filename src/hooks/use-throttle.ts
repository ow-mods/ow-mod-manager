import { useEffect, useCallback, useRef } from 'react';

export function useThrottle(callback: () => unknown, delay = 100) {
  const nextTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clean up pending timeouts when props change / on unmount.
  useEffect(
    () => () => {
      if (nextTimeout.current !== null) {
        clearTimeout(nextTimeout.current);
        nextTimeout.current = null;
      }
    },
    [callback, delay],
  );

  return useCallback(
    function () {
      if (nextTimeout.current === null) {
        const next = () => {
          nextTimeout.current = null;
          callback();
        };

        nextTimeout.current = setTimeout(next, delay);
      }
    },
    [callback, delay],
  );
}
