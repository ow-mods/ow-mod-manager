import { useEffect, useState } from 'react';
import net from 'net';

function useOwmlLogWatcher() {
  const [lines, setLines] = useState<string[]>([]);

  function writeLines(...lines: string[]) {
    setLines((prevLines) => [...prevLines, ...lines]);
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
