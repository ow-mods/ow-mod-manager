import React from 'react';
import useOwmlLogWatcher from '../hooks/use-owml-logs-watcher';
import { Typography, Card, List, ListItem } from '@material-ui/core';

const OwmlLog: React.FunctionComponent = () => {
  const logLines = useOwmlLogWatcher();

  return (
    <Card>
      <List dense>
        {logLines.map((line, index) => (
          <ListItem key={index}>
            <Typography>{line}</Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default OwmlLog;
