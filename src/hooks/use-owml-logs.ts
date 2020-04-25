import { useEffect, useState } from 'react';
import net from 'net';

function useOwmlLogs() {
  const [lines, setLines] = useState<LogLine[]>([]);

  function writeLine(line: LogLine) {
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

  function writeText(...textLines: string[]) {
    console.log('writeText', ...textLines);
    textLines.forEach((text, index) =>
      writeLine({
        type: 'log',
        text,
        count: 1,
        id: index,
      }),
    );
  }

  useEffect(() => {
    const server = net.createServer((socket) => {
      socket.pipe(socket);
      socket.on('data', (data) => {
        const dataLines = data
          .toString()
          .split('\n')
          .filter((line) => line);
        writeText(...dataLines);
      });
      socket.on('error', (error) => {
        writeText(`SOCKET ERROR: ${error.toString()}`);
        server.close();
      });
      socket.on('end', () => {
        writeText('Console socket closed');
        server.close();
      });
    });

    server.listen(3030, '127.0.0.1');
    writeText('Started console server');

    server.on('connection', () => {
      writeText('Game connected to console');
    });

    return () => {
      server.close();
    };
  }, []);

  return lines;
}

export default useOwmlLogs;
