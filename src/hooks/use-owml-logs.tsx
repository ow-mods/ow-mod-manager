import React, { useEffect, useState, useContext } from 'react';
import net from 'net';

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
  } else if (lowerText.includes('warning') || lowerText.includes('disabled')) {
    return 'warning';
  } else if (lowerText.includes('success')) {
    return 'success';
  } else {
    return 'log';
  }
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

function getSimpleLine(text: string, type: LogType = 'log'): LogLine {
  return {
    type,
    text,
    count: 1,
    id: 0,
    modName: 'Mod Manager',
  };
}

export const LogsProvider: React.FunctionComponent = ({ children }) => {
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
      } else {
        return [
          ...prevLines,
          {
            ...line,
            id: prevLines.length + 1,
          },
        ];
      }
    });
  }

  function writeLogText(...textLines: string[]) {
    textLines.forEach((textLine) => writeLogLine(getLogLine(textLine)));
  }

  function writeSimpleText(textLine: string, type?: LogType) {
    writeLogLine(getSimpleLine(textLine, type));
  }

  function clear() {
    setLines([]);
  }

  function signalServerOpen() {
    setIsServerRunning(true);
    writeSimpleText('Client connected to console', 'success');
  }

  function signalServerClosed() {
    setIsServerRunning(false);
    writeSimpleText('Client disconnected from console', 'warning');
  }

  useEffect(() => {
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
