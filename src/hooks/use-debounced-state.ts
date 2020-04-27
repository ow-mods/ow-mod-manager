import { useState } from 'react';

import { useDebounce } from './use-debounce';

export function useDebouncedState<Value>(initial: Value, delay: number) {
  const [value, setValue] = useState<Value>(initial);
  const debouncedValue = useDebounce(value, delay);

  return [value, debouncedValue, setValue] as [Value, Value, typeof setValue];
}
