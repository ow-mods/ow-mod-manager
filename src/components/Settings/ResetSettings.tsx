import React, { useCallback } from 'react';
import { Button, ListItem } from '@material-ui/core';
import { SettingsBackupRestore as RestoreIcon } from '@material-ui/icons';

import config from '../../config.json';
import { useSettings } from '../../hooks';

const ResetSettings = () => {
  const { setSettings } = useSettings();

  const handleResetClick = useCallback(() => {
    setSettings(config.defaultSettings);
  }, []);

  return (
    <ListItem>
      <Button
        variant="contained"
        onClick={handleResetClick}
        startIcon={<RestoreIcon />}
      >
        Reset all to settings to default
      </Button>
    </ListItem>
  );
};

export default ResetSettings;
