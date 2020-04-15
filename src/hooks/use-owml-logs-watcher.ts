import { useEffect, useState } from 'react';
import fs from 'fs-extra';
import os from 'os';

import config from '../config.json';

type Handler = () => void;
const path = `${config.owmlPath}/Logs/OWML.Output.txt`;
const endOfLineChar = os.EOL;

function parseBuffer(buffer: Buffer) {
  return buffer
    .toString()
    .split(endOfLineChar)
    .filter((line) => line.length > 0);
}

function useOwmlLogWatcher() {
  const [, setFileSize] = useState(0);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    function getLines() {
      setFileSize((prevSize) => {
        const size = fs.statSync(path).size;
        let sizeDiff = size - prevSize;

        if (sizeDiff < 0) {
          setFileSize(0);
          sizeDiff = size;
        }

        const buffer = new Buffer(sizeDiff);
        const fileDescriptor = fs.openSync(path, 'r');

        fs.readSync(fileDescriptor, buffer, 0, sizeDiff, prevSize);
        fs.closeSync(fileDescriptor);

        const newLines = parseBuffer(buffer);
        setLines((prevLines) => [...prevLines, ...newLines]);

        return size;
      });
    }

    const watcher = fs.watch(path, getLines);

    getLines();

    return () => watcher.close();
  }, []);

  return lines;
}

export default useOwmlLogWatcher;
