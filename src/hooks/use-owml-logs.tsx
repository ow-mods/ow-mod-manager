import React, { useEffect, useState, useContext, useCallback } from 'react';
import net from 'net';

import { logsText } from '../static-text';
import { useNotifications } from './use-notifications';
import { SocketMessage, SocketMessageType, LogLine, LogType } from '../types';

type LogsContext = {
  logLines: LogLine[];
  isServerRunning: boolean;
  clear: () => void;
  serverPort: number;
};

const LogsState = React.createContext<LogsContext>({
  logLines: [],
  isServerRunning: false,
  clear: () => {},
  serverPort: 0,
});

export const useOwmlLogs = () => useContext(LogsState);

function getLogLine(lineText: string): LogLine {
  const socketMessage: SocketMessage = JSON.parse(lineText);
  return {
    type: SocketMessageType[socketMessage.type] as LogType,
    count: 1,
    id: 0,
    text: socketMessage.message,
    modName: socketMessage.senderName,
  };
}

function getSimpleLine(text: string, type: LogType = 'Message'): LogLine {
  return {
    type,
    text,
    count: 1,
    id: 0,
    modName: 'Mod Manager',
  };
}

export const LogsProvider: React.FunctionComponent = ({ children }) => {
  const { notifications } = useNotifications();
  const [notificationIds, setNotificationIds] = useState<string[]>([]);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverPort, setServerPort] = useState(0);

  const writeLogLine = useCallback((line: LogLine) => {
    setLines((prevLines) => {
      const lastIndex = prevLines.length - 1;
      const lastItem = prevLines[lastIndex];

      if (prevLines.length > 0 && line.text === lastItem.text) {
        return [
          ...prevLines.slice(0, lastIndex),
          {
            ...lastItem,
            count: lastItem.count + 1,
          },
        ];
      }
      return [
        ...prevLines,
        {
          ...line,
          id: prevLines.length + 1,
        },
      ];
    });
  }, []);

  const writeSimpleText = useCallback(
    (textLine: string, type?: LogType) => {
      writeLogLine(getSimpleLine(textLine, type));
    },
    [writeLogLine],
  );

  const clear = useCallback(() => setLines([]), []);

  useEffect(() => {
    function writeLogText(...textLines: string[]) {
      textLines.forEach((textLine) => writeLogLine(getLogLine(textLine)));
    }

    function signalServerOpen() {
      setIsServerRunning(true);
      writeSimpleText(logsText.connectedToConsole, 'Success');
    }

    function signalServerClosed() {
      setIsServerRunning(false);
      writeSimpleText(logsText.disconnectedFromConsole, 'Warning');
    }

    const netServer = net.createServer((socket) => {
      socket.pipe(socket);
      socket.on('data', (data) => {
        const dataLines = data
          .toString()
          .split('\n')
          .filter((line) => line);
        writeLogText(...dataLines);
      });
      socket.on('error', (error) => {
        writeSimpleText(
          `${logsText.socketError}: ${error.toString()}`,
          'Error',
        );
        signalServerClosed();
      });
      socket.on('end', () => {
        signalServerClosed();
        netServer.close();
      });
    });

    netServer.on('connection', signalServerOpen);
    netServer.on('close', signalServerClosed);
    netServer.on('listening', () => {
      const port = (netServer.address() as net.AddressInfo).port;
      writeSimpleText(logsText.consoleServerStart(port), 'Success');
      setServerPort(port);
    });

    netServer.listen(0, '127.0.0.1');

    return signalServerClosed;
  }, [writeLogLine, writeSimpleText]);

  useEffect(() => {
    notifications
      .filter(({ id }) => !notificationIds.includes(id))
      .forEach(({ id, severity, message }) => {
        setNotificationIds((ids) => [...ids, id]);
        writeSimpleText(message, severity);
      });
  }, [notifications, writeSimpleText, notificationIds]);

  return (
    <LogsState.Provider
      value={{
        logLines: lines,
        isServerRunning,
        clear,
        serverPort,
      }}
    >
      {children}
    </LogsState.Provider>
  );
};
