import React, { useEffect } from 'react';
import useOwmlLogWatcher from '../hooks/use-owml-logs-watcher';
import { Typography, Card, List, ListItem } from '@material-ui/core';

const OwmlLog: React.FunctionComponent = () => {
  const logLines = useOwmlLogWatcher();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [logLines]);

  return (
    <Card>
      <List dense>
        {logLines.map((line, index) => (
          <ListItem key={index}>
            <Typography>
              ({line.count}) {line.text}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default OwmlLog;
