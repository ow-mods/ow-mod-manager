export enum SocketMessageType {
  Message = 0,
  Error = 1,
  Warning = 2,
  Info = 3,
  Success = 4,
  Quit = 5,
  Fatal = 6,
  Debug = 7,
}

export type SocketMessage = {
  senderName: string;
  senderType: string;
  type: SocketMessageType;
  message: string;
};

export type LogType = keyof typeof SocketMessageType;

export type LogLine = {
  modName: string;
  text: string;
  type: LogType;
  count: number;
  id: number;
};
