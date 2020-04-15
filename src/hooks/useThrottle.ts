import {
  useEffect,
  useCallback,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';

function useThrottleCallback(callback: () => any, delay = 100) {
  const nextTimeout = useRef<NodeJS.Timeout | null>(null);

  // cleans up pending timeouts when the function changes
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

export default useThrottleCallback;
