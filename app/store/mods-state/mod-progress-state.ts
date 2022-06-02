import { atomFamily } from 'recoil';

export const modProgressState = atomFamily<number, string | undefined>({
  key: 'ModProgress',
  default: 0,
});

export const modIsLoadingState = atomFamily<boolean, string | undefined>({
  key: 'ModIsLoading',
  default: false,
});
