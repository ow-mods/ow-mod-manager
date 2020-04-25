import React, { useEffect } from 'react';
import useOwmlLogs from '../hooks/use-owml-logs';
import {
  Typography,
  Card,
  List,
  ListItem,
  ListItemSecondaryAction,
  Divider,
} from '@material-ui/core';

const OwmlLog: React.FunctionComponent = () => {
  const logLines = useOwmlLogs();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [logLines]);

  return (
    <Card>
      <List dense>
        {logLines.map((line: LogLine) => (
          <React.Fragment key={line.id}>
            <ListItem>
              <Typography>{line.text}</Typography>
              {line.count > 1 && (
                <ListItemSecondaryAction>
                  <Typography>{line.count}</Typography>
                </ListItemSecondaryAction>
              )}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default OwmlLog;
