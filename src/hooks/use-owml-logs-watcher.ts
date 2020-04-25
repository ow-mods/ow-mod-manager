import { useEffect, useState } from 'react';
import net from 'net';

function useOwmlLogWatcher() {
  const [lines, setLines] = useState<LogLine[]>([]);

  function writeLine(line: LogLine) {
    setLines((prevLines) => {
      if (
        prevLines.length > 0 &&
        line.text === prevLines[prevLines.length - 1].text
      ) {
        return [
          ...prevLines.slice(0, prevLines.length - 1),
          {
            ...prevLines[prevLines.length - 1],
            count: prevLines[prevLines.length - 1].count + 1,
          },
        ];
      } else {
        return [...prevLines, line];
      }
    });
  }

  function writeLines(...textLines: string[]) {
    textLines.forEach((textLine) =>
      writeLine({
        type: 'log',
        text: textLine,
        count: 1,
      }),
    );
  }

  useEffect(() => {
    const server = net.createServer((socket) => {
      console.log('creating server...', socket);
      socket.write('Echo server\r\n');
      socket.pipe(socket);
      socket.on('data', (data) => {
        const lines = data
          .toString()
          .split('\n')
          .filter((line) => line);
        writeLines(...lines);
      });
      socket.on('error', (error) => {
        writeLines(`SOCKET ERROR: ${error.toString()}`);
        socket.destroy();
      });
      socket.on('end', () => {
        writeLines('Console socket closed');
        socket.destroy();
      });
    });

    server.listen(1234, '127.0.0.1');
  }, []);

  return lines;
}

export default useOwmlLogWatcher;
