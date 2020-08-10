import React, { useCallback, useEffect } from 'react';

import { useSetRecoilState } from 'recoil';
import net from 'net';
import { remote } from 'electron';
import {
  logLinesState,
  isLogServerRunningState,
  logServerPortState,
} from '../store';

import config from '../config.json';
import { logsText } from '../static-text';
import { SocketMessage, SocketMessageType, LogLine, LogType } from '../types';

function tryJsonParse<T>(fileText: string) {
  try {
    return JSON.parse(fileText) as T;
  } catch (error) {
    console.error(`${logsText.messageParseError}: ${error}`);
    return fileText;
  }
}

function getLogLine(lineText: string): LogLine {
  const socketMessage = tryJsonParse<SocketMessage>(lineText);

  if (typeof socketMessage === 'string') {
    return {
      type: 'Message',
      count: 1,
      id: 0,
      text: socketMessage,
      modName: 'Unknown',
    };
  }

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

async function showFatalMessageDialog(line: LogLine) {
  const browserWindow = new remote.BrowserWindow({
    show: false,
    alwaysOnTop: true,
  });

  await remote.dialog.showMessageBox(browserWindow, {
    type: 'error',
    title: line.modName,
    message: line.text,
  });

  browserWindow.destroy();
}

export const LogsSubscription: React.FunctionComponent = () => {
  const setLines = useSetRecoilState(logLinesState);
  const setIsServerRunning = useSetRecoilState(isLogServerRunningState);
  const setServerPort = useSetRecoilState(logServerPortState);

  const writeLogLine = useCallback(
    (line: LogLine) => {
      if (line.type === SocketMessageType[SocketMessageType.Fatal]) {
        showFatalMessageDialog(line);
      }

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
        ].filter((l) => {
          for (let i = 0; i < config.ignoredErrors.length; i += 1) {
            if (l.text.includes(config.ignoredErrors[i])) {
              return false;
            }
          }
          return true;
        });
      });
    },
    [setLines]
  );

  const writeSimpleText = useCallback(
    (textLine: string, type?: LogType) => {
      writeLogLine(getSimpleLine(textLine, type));
    },
    [writeLogLine]
  );

  useEffect(() => {
    console.log('useEffect: LogsSubscription create server');
    function writeLogText(...textLines: string[]) {
      textLines.forEach((textLine) => writeLogLine(getLogLine(textLine)));
    }

    function signalServerOpen() {
      setIsServerRunning(true);
      writeSimpleText(logsText.connectedToConsole, 'Info');
    }

    function signalServerClosed() {
      setIsServerRunning(false);
      writeSimpleText(logsText.disconnectedFromConsole, 'Info');
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
          'Error'
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
      const { port } = netServer.address() as net.AddressInfo;
      writeSimpleText(logsText.consoleServerStart(port), 'Info');
      setServerPort(port);
    });

    netServer.listen(0, '127.0.0.1');

    return signalServerClosed;
  }, [writeLogLine, writeSimpleText, setServerPort, setIsServerRunning]);

  return null;
};
