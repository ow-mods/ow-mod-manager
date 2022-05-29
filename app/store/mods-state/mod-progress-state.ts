import { atomFamily } from 'recoil';

export const modProgressState = atomFamily<number, string>({
  key: 'ModProgress',
  default: 0,
});

export const modIsLoadingState = atomFamily<boolean, string>({
  key: 'ModIsLoading',
  default: false,
});
