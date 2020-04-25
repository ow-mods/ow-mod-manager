import { useEffect, useState } from 'react';
import net from 'net';

function useOwmlLogWatcher() {
  const [lines, setLines] = useState<string[]>([]);

  function writeLine(line: string) {
    setLines((prevLines) => [...prevLines, line]);
  }

  useEffect(() => {
    const server = net.createServer((socket) => {
      console.log('creating server...', socket);
      socket.write('Echo server\r\n');
      socket.pipe(socket);
      socket.on('data', (data) => {
        writeLine(data.toString());
      });
      socket.on('error', (error) => {
        writeLine(`SOCKET ERROR: ${error.toString()}`);
      });
      socket.on('end', () => {
        writeLine('Console socket closed');
        socket.destroy();
      });
    });

    server.listen(1234, '127.0.0.1');
  }, []);

  return lines;
}

export default useOwmlLogWatcher;
