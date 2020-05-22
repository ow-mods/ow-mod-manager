import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSettings, SettingsContext } from '../../hooks';
import { List, Paper, ListItem, Divider } from '@material-ui/core';

type SettingKey = keyof SettingsContext['settings'];

type SettingsInput = {
  key: SettingKey;
  label: string;
};

const settingsInputs: SettingsInput[] = [
  {
    key: 'closeOnPlay',
    label: 'Close Mod Manager on game start',
  },
  {
    key: 'logToSocket',
    label: 'Send game logs to Mod Manager',
  },
];

const Settings = () => {
  const { settings, setSettings } = useSettings();

  const handleSwitchClick = (key: SettingKey) => (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setSettings({ [key]: !settings[key] });
  };

  return (
    <List component={Paper}>
      {settingsInputs.map(({ key, label }) => (
        <React.Fragment key={key}>
          <ListItem button onClick={handleSwitchClick(key)}>
            <FormControlLabel
              control={<Switch checked={settings[key]} />}
              label={label}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export default Settings;
