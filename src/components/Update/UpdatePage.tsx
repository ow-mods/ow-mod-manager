import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';

import { useAppUpdate } from '../../hooks';

const UpdatePage: React.FunctionComponent = () => {
  const { isDownloading, progress, updateApp } = useAppUpdate();

  return (
    <Card>
      <CardHeader title="New update available for the Outer Wilds Mod Manager" />
      <CardContent>
        {!isDownloading && (
          <Button
            startIcon={<DownloadIcon />}
            color="primary"
            variant="contained"
            onClick={updateApp}
          >
            Download update
          </Button>
        )}
        {isDownloading && (
          <>
            Downloading update...
            <LinearProgress
              style={{ height: 15, borderRadius: 5 }}
              variant="determinate"
              value={progress * 100}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdatePage;
