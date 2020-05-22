import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSettings } from '../../hooks';
import { Card, CardContent } from '@material-ui/core';

const Settings = () => {
  const settings = useSettings();
  const { setSettings, closeOnPlay } = settings;

  return (
    <Card>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default Settings;
