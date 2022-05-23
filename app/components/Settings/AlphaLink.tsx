import React, { useCallback } from 'react';
import { Button, ListItem, makeStyles } from '@material-ui/core';
import { GetApp as DownloadIcon } from '@material-ui/icons';

const useStyles = makeStyles({
  root: {
    justifyContent: 'flex-end',
  },
});

const AlphaLink = () => {
  const styles = useStyles();

  const handleClick = useCallback(() => {
    const win = window.open(
      'https://web.archive.org/web/20150726160905if_/http://alexbeachum.com/outerwildsDownloads/OuterWilds_Alpha_1_2_PC.zip',
      'Wayback Machine'
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
        Download Outer Wilds Alpha
      </Button>
    </ListItem>
  );
};

export default AlphaLink;
