import React, { useEffect } from 'react';
import useOwmlLogWatcher from '../hooks/use-owml-logs-watcher';
import {
  Typography,
  Card,
  List,
  ListItem,
  Chip,
  ListItemSecondaryAction,
  Divider,
} from '@material-ui/core';

const OwmlLog: React.FunctionComponent = () => {
  const logLines = useOwmlLogWatcher();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [logLines]);

  return (
    <Card>
      <List dense>
        {logLines.map((line, index) => (
          <>
            <ListItem key={index}>
              <Typography>
                {line.text}
                {line.count > 1 && (
                  <ListItemSecondaryAction>
                    {line.count}
                  </ListItemSecondaryAction>
                )}
              </Typography>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Card>
  );
};

export default OwmlLog;
