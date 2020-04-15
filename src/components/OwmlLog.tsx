import React from 'react';
import useOwmlLogWatcher from '../hooks/use-owml-logs-watcher';

const OwmlLog: React.FunctionComponent = () => {
  const logLines = useOwmlLogWatcher();

  return (
    <ul>
      {logLines.map((line, index) => (
        <li key={index}>{line}</li>
      ))}
    </ul>
  );
};

export default OwmlLog;
