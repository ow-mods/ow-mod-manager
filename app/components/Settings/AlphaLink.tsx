import React, { useCallback } from 'react';
import { Button, ListItem, makeStyles } from '@material-ui/core';
import { GetApp as DownloadIcon } from '@material-ui/icons';
import { globalText } from '../../helpers/static-text';

const useStyles = makeStyles({
  root: {
    justifyContent: 'flex-end',
  },
});

const AlphaLink = () => {
  const styles = useStyles();

  const handleClick = useCallback(() => {
    const win = window.open(
      'https://outerwildsmods.com/outer-wilds-alpha/',
      ''
    );
    if (win != null) {
      win.focus();
    }
  }, []);

  return (
    <ListItem className={styles.root}>
      <Button
        variant="contained"
        onClick={handleClick}
        startIcon={<DownloadIcon />}
      >
        {globalText.alphaWebsite}
      </Button>
    </ListItem>
  );
};

export default AlphaLink;
