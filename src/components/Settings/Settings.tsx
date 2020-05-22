import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import { useSettings } from '../../hooks';

const Settings = () => {
  const settings = useSettings();
  const { setSettings, closeOnPlay } = settings;

  return (
    <div>
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
    </div>
  );
};

export default Settings;
