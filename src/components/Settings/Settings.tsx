import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSettings } from '../../hooks';
import { FormGroup, List, Paper, ListItem, Divider } from '@material-ui/core';

const Settings = () => {
  const { settings, setSettings } = useSettings();
  const { closeOnPlay, logToSocket } = settings;

  return (
    <List component={Paper}>
      <FormGroup>
        <ListItem
          button
          onClick={() =>
            setSettings({
              closeOnPlay: !closeOnPlay,
            })
          }
        >
          <FormControlLabel
            control={<Switch checked={closeOnPlay} />}
            label="Close Mod Manager on game start"
          />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() =>
            setSettings({
              logToSocket: !logToSocket,
            })
          }
        >
          <FormControlLabel
            control={<Switch checked={logToSocket} />}
            label="Send game logs to Mod Manager"
          />
        </ListItem>
      </FormGroup>
    </List>
  );
};

export default Settings;
