import React from 'react';
import {
  Card,
  CardContent,
  Button,
  LinearProgress,
  Typography,
  Grid,
  makeStyles,
  Chip,
} from '@material-ui/core';
import {
  CloudDownload as DownloadIcon,
  SystemUpdateAlt as UpdateIcon,
} from '@material-ui/icons';

import { updateText } from '../../static-text';
import { useAppUpdate, useAppState } from '../../hooks';
import { installAppUpdate } from '../../services';
import { remote } from 'electron';
import PageContainer from '../PageContainer';

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
    <Typography>{updateText.unableToGetRelease}</Typography>;
  }

  const getStatusText = () => {
    if (isDownloading) {
      return updateText.downloading;
    }
    if (isUpdateReady) {
      return updateText.installReady;
    }
    return updateText.downloadReady;
  };

  return (
    <PageContainer>
      <Grid
        container
        spacing={3}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item container spacing={1} direction="column" alignItems="center">
          <Grid item>
            {updateText.installedVersion}
            <Chip label={remote.app.getVersion()} />
          </Grid>
          <Grid item>
            {updateText.latestVersion}
            <Chip label={appRelease?.version} color="secondary" />
          </Grid>
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
                    {updateText.download}
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
                    {updateText.installAndRestart}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UpdatePage;
