import React, { useEffect, useState, useContext } from 'react';
import net from 'net';

import { useAppState } from './use-app-state';
import config from '../config.json';

type LogsContext = {
  logLines: LogLine[];
  startServer: () => Promise<number>;
  isLoggerInstalled: boolean;
};

const LogsState = React.createContext<LogsContext>({
  logLines: [],
  startServer: () => new Promise(() => {}),
  isLoggerInstalled: false,
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
  const [server, setServer] = useState<net.Server>();

  const {
    modMap: { [config.consoleMod]: consoleMod },
  } = useAppState();
  const [isLoggerInstalled, setIsLoggerInstalled] = useState(false);

  useEffect(() => {
    if (consoleMod) {
      setIsLoggerInstalled(Boolean(consoleMod.isEnabled));
    }
  }, [consoleMod]);

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

  async function startServer() {
    if (!server) {
      throw new Error('Tried to start server but it has not been initialized');
    }

    return new Promise<number>((resolve, reject) => {
      server.on('listening', () => {
        const port = (server.address() as net.AddressInfo).port;
        writeSimpleText(`Started console server on port ${port}`, 'success');
        resolve(port);
      });

      server.on('error', () => {
        reject();
      });

      server.listen(0, '127.0.0.1');
    });
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
        netServer.close();
      });
      socket.on('end', () => {
        writeSimpleText('Console socket closed', 'warning');
        netServer.close();
      });
    });

    setServer(netServer);

    netServer.on('connection', () => {
      writeSimpleText('Game connected to console', 'success');
    });

    return () => {
      netServer.close();
    };
  }, []);

  return (
    <LogsState.Provider
      value={{
        logLines: lines,
        startServer,
        isLoggerInstalled,
      }}
    >
      {children}
    </LogsState.Provider>
  );
};
