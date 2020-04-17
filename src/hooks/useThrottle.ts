import { useEffect, useCallback, useRef } from 'react';

function useThrottleCallback(callback: () => any, delay = 100) {
  const nextTimeout = useRef<NodeJS.Timeout | null>(null);

  // Clean up pending timeouts on unmount.
  useEffect(
    () => () => {
      if (nextTimeout.current !== null) {
        clearTimeout(nextTimeout.current);
        nextTimeout.current = null;
      }
    },
    [],
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

export default useThrottleCallback;
