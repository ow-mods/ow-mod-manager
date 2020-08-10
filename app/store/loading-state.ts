import { atom, useRecoilState } from 'recoil';
import { useCallback } from 'react';

const loadingCountState = atom({
  key: 'LoadingCount',
  default: 0,
});

export const useLoading = () => {
  const [loadingCount, setLoadingCount] = useRecoilState(loadingCountState);

  const startLoading = useCallback(
    () => setLoadingCount((currentCount) => currentCount + 1),
    [setLoadingCount]
  );

  const endLoading = useCallback(
    () => setLoadingCount((currentCount) => currentCount - 1),
    [setLoadingCount]
  );

  return {
    startLoading,
    endLoading,
    isLoading: loadingCount > 0,
  };
};
