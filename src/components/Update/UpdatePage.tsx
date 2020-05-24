import React from 'react';
import {
  Card,
  CardContent,
  Button,
  LinearProgress,
  Typography,
  Grid,
  makeStyles,
  Paper,
  Chip,
} from '@material-ui/core';
import {
  CloudDownload as DownloadIcon,
  SystemUpdateAlt as UpdateIcon,
} from '@material-ui/icons';

import { useAppUpdate, useAppState } from '../../hooks';
import { installAppUpdate } from '../../services';
import { remote } from 'electron';

const useStyles = makeStyles((theme) => ({
  progress: {
    background: theme.palette.background.default,
    height: 20,
    borderRadius: 5,
  },
}));

const UpdatePage: React.FunctionComponent = () => {
  const styles = useStyles();
  const { isDownloading, progress, updateApp, isUpdateReady } = useAppUpdate();
  const { appRelease } = useAppState();

  if (!appRelease) {
    <Typography>Unable to get latest app release</Typography>;
  }

  const getStatusText = () => {
    if (isDownloading) {
      return 'Downloading update...';
    }
    if (isUpdateReady) {
      return 'Ready to install update';
    }
    return 'Ready to download update';
  };

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography gutterBottom align="right">
          Installed: <Chip label={remote.app.getVersion()} />
        </Typography>
        <Typography align="right">
          Latest: <Chip label={appRelease?.version} color="secondary" />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardContent>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Typography>{getStatusText()}</Typography>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<DownloadIcon />}
                  color="primary"
                  variant="contained"
                  onClick={updateApp}
                  disabled={isUpdateReady || isDownloading}
                  fullWidth
                >
                  Download update
                </Button>
              </Grid>
              <Grid item>
                <LinearProgress
                  className={styles.progress}
                  variant="determinate"
                  value={progress === 0 ? -1 : progress * 100}
                />
              </Grid>
              <Grid item>
                <Button
                  startIcon={<UpdateIcon />}
                  color="secondary"
                  variant="contained"
                  onClick={installAppUpdate}
                  disabled={!isUpdateReady}
                  fullWidth
                >
                  Install update and restart
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UpdatePage;
