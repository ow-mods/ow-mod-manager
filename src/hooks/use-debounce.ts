import { useEffect, useState } from 'react';

function useDebounce<Value>(value: Value, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<Value>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
