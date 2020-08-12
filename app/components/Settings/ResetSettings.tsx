import React, { useCallback } from 'react';
import { Button, ListItem, makeStyles } from '@material-ui/core';
import { SettingsBackupRestore as RestoreIcon } from '@material-ui/icons';

import { settingsText } from '../../static-text';
import { useSettings } from '../../hooks';
import { getDefaultAppSettings } from '../../services';

const useStyles = makeStyles({
  root: {
    justifyContent: 'flex-end',
  },
});

const ResetSettings = () => {
  const styles = useStyles();
  const { setSettings } = useSettings();

  const handleResetClick = useCallback(() => {
    setSettings(getDefaultAppSettings());
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
