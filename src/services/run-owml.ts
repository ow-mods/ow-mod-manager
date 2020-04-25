import exec from 'child_process';
import net from 'net';
import config from '../config.json';

const EXE_FILE = 'OWML.Launcher.exe';
const options = {
  shell: true,
  cwd: config.owmlPath,
};

function runOwml() {
  const server = net.createServer((socket) => {
    console.log('creating server...', socket);
    socket.write('Echo server\r\n');
    socket.pipe(socket);
    socket.on('data', (data) => {
      console.log('data', data.toString());
    });
    socket.on('error', (error) => {
      console.log('error', error.toString());
    });
  });

  server.listen(1234, '127.0.0.1');
  console.log('created server');

  // exec.execFile(EXE_FILE, options, (error) => {
  //   if (error) {
  //     throw error;
  //   }
  // });
}

export default runOwml;
