import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSettings } from '../../hooks';
import { FormGroup } from '@material-ui/core';

const Settings = () => {
  const settings = useSettings();
  const { setSettings, closeOnPlay, logToSocket } = settings;

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={closeOnPlay}
            onChange={() =>
              setSettings({
                closeOnPlay: !closeOnPlay,
              })
            }
          />
        }
        label="Close Mod Manager on game start"
      />
      <FormControlLabel
        control={
          <Switch
            checked={logToSocket}
            onChange={() =>
              setSettings({
                logToSocket: !logToSocket,
              })
            }
          />
        }
        label="Send game logs to Mod Manager"
      />
    </FormGroup>
  );
};

export default Settings;
