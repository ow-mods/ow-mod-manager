import { useEffect, useState } from 'react';
import fs from 'fs-extra';
import os from 'os';

import config from '../config.json';
import useThrottle from './use-throttle';

type Handler = () => void;
const path = `${config.owmlPath}/Logs/OWML.Log.txt`;
const endOfLineChar = os.EOL;

function parseBuffer(buffer: Buffer) {
  // Iterate over each line in the buffer.
  return buffer
    .toString()
    .split(endOfLineChar)
    .filter((line) => line.length > 0);
}

function useOwmlLogWatcher() {
  const [fileSize, setFileSize] = useState(0);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    function getLines() {
      // Check if file modified time is less than last time.
      // If so, nothing changed so don't bother parsing.
      // if (current.mtime <= previous.mtime) {
      //   return;
      // }
      setFileSize((prevSize) => {
        // We're only going to read the portion of the file that
        // we have not read so far. Obtain new file size.
        const size = fs.statSync(path).size;
        // Calculate size difference.
        let sizeDiff = size - prevSize;
        // If less than zero then Hearthstone truncated its log file
        // since we last read it in order to save space.
        // Set fileSize to zero and set the size difference to the current
        // size of the file.
        if (sizeDiff < 0) {
          setFileSize(0);
          sizeDiff = size;
        }
        // Create a buffer to hold only the data we intend to read.
        const buffer = new Buffer(sizeDiff);
        // Obtain reference to the file's descriptor.
        const fileDescriptor = fs.openSync(path, 'r');
        // Synchronously read from the file starting from where we read
        // to last time and store data in our buffer.
        fs.readSync(fileDescriptor, buffer, 0, sizeDiff, prevSize);
        fs.closeSync(fileDescriptor);

        // Parse the line(s) in the buffer.
        const newLines = parseBuffer(buffer);
        setLines((prevLines) => [...prevLines, ...newLines]);

        return size;
      });
    }

    const watcher = fs.watch(path, getLines);

    // Call the handler one first time.
    //handler();

    getLines();

    return watcher.close;
  }, []);

  return lines;
}

export default useOwmlLogWatcher;
