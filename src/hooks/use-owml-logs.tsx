import React, { useEffect, useState, useContext } from 'react';
import net from 'net';

type LogsContext = {
  logLines: LogLine[];
  startServer: () => void;
};

const LogsState = React.createContext<LogsContext>({
  logLines: [],
  startServer: () => {},
});

export const useOwmlLogs = () => useContext(LogsState);

function getLogLine(lineText: string): LogLine {
  const [modName, text] = lineText.split(';;');
  return {
    type: 'log',
    count: 1,
    id: 0,
    text,
    modName,
  };
}

function getSimpleLine(text: string): LogLine {
  return {
    type: 'log',
    count: 1,
    id: 0,
    text,
    modName: 'Mod Manager',
  };
}

export const LogsProvider: React.FunctionComponent = ({ children }) => {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [server, setServer] = useState<net.Server>();

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

  function writeSimpleText(...textLines: string[]) {
    textLines.forEach((textLine) => writeLogLine(getSimpleLine(textLine)));
  }

  function startServer() {
    server.listen(3030, '127.0.0.1');
    writeSimpleText('Started console server');
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
        writeSimpleText(`SOCKET ERROR: ${error.toString()}`);
        netServer.close();
      });
      socket.on('end', () => {
        writeSimpleText('Console socket closed');
        netServer.close();
      });
    });

    setServer(netServer);

    netServer.on('connection', () => {
      writeSimpleText('Game connected to console');
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
      }}
    >
      {children}
    </LogsState.Provider>
  );
};

export default useOwmlLogs;
