import React, { useEffect, useState, useContext, useCallback } from 'react';
import net from 'net';
import { useNotifications } from './use-notifications';

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

function getLogType(text: string): LogType {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('error') || lowerText.includes('exception')) {
    return 'error';
  }
  if (lowerText.includes('warning') || lowerText.includes('disabled')) {
    return 'warning';
  }
  if (lowerText.includes('success')) {
    return 'success';
  }
  return 'info';
}

function getLogLine(lineText: string): LogLine {
  const [modName, text] = lineText.split(';;');

  return {
    type: getLogType(text),
    count: 1,
    id: 0,
    text,
    modName,
  };
}

function getSimpleLine(text: string, type: LogType = 'info'): LogLine {
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
  const [, setNotificationIds] = useState<number[]>([]);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverPort, setServerPort] = useState(0);

  function writeLogLine(line: LogLine) {
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
  }

  const clear = useCallback(() => setLines([]), []);

  useEffect(() => {
    function writeLogText(...textLines: string[]) {
      textLines.forEach((textLine) => writeLogLine(getLogLine(textLine)));
    }

    function writeSimpleText(textLine: string, type?: LogType) {
      writeLogLine(getSimpleLine(textLine, type));
    }

    function signalServerOpen() {
      setIsServerRunning(true);
      writeSimpleText('Client connected to console', 'success');
    }

    function signalServerClosed() {
      setIsServerRunning(false);
      writeSimpleText('Client disconnected from console', 'warning');
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
        writeSimpleText(`SOCKET ERROR: ${error.toString()}`, 'error');
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
      writeSimpleText(`Started console server on port ${port}`, 'success');
      setServerPort(port);
    });

    netServer.listen(0, '127.0.0.1');

    return signalServerClosed;
  }, []);

  useEffect(() => {
    notifications.forEach(({ id, severity, message }) => {
      setNotificationIds((ids) => {
        if (!ids.includes(id)) {
          writeLogLine({
            modName: 'Mod Manager',
            id,
            count: 0,
            text: message,
            type: severity,
          });

          return [...ids, id];
        }
        return ids;
      });
    });
  }, [notifications]);

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
