import React, { useCallback } from 'react';
import { Button, ListItem, makeStyles } from '@material-ui/core';
import { SettingsBackupRestore as RestoreIcon } from '@material-ui/icons';

import { settingsText } from '../../static-text';
import config from '../../config.json';
import { useSettings } from '../../hooks';

const useStyles = makeStyles({
  root: {
    justifyContent: 'flex-end',
  },
});

const ResetSettings = () => {
  const styles = useStyles();
  const { setSettings } = useSettings();

  const handleResetClick = useCallback(() => {
    setSettings(config.defaultSettings);
  }, [setSettings]);

  return (
    <ListItem className={styles.root}>
      <Button
        variant="contained"
        onClick={handleResetClick}
        startIcon={<RestoreIcon />}
      >
        {settingsText.resetToDefault}
      </Button>
    </ListItem>
  );
};

export default ResetSettings;
