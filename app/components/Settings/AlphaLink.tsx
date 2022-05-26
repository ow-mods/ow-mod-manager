import React, { useCallback } from 'react';
import { Button, ListItem, makeStyles } from '@material-ui/core';
import { Launch as DownloadIcon } from '@material-ui/icons';
import { shell } from 'electron';
import { globalText } from '../../helpers/static-text';

const outerWildsAlphaUrl = 'https://outerwildsmods.com/outer-wilds-alpha/';

const useStyles = makeStyles({
  root: {
    justifyContent: 'flex-end',
  },
});

const AlphaLink = () => {
  const styles = useStyles();

  const handleClick = useCallback(() => {
    shell.openExternal(outerWildsAlphaUrl);
  }, []);

  return (
    <ListItem className={styles.root}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClick}
        startIcon={<DownloadIcon />}
      >
        {globalText.alphaWebsite}
      </Button>
    </ListItem>
  );
};

export default AlphaLink;
