import { atom } from 'recoil';

import { LogLine } from '../types';

export const logLinesState = atom<LogLine[]>({
  key: 'LogLines',
  default: [],
});

export const isLogServerRunningState = atom({
  key: 'IsLogServerRunning',
  default: false,
});

export const logServerPortState = atom({
  key: 'LogServerPort',
  default: 0,
});
