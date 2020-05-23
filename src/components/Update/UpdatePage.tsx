import React from 'react';
import { remote } from 'electron';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';
import { downloadAppUpdate } from '../../services';

const UpdatePage: React.FunctionComponent = () => {
  return (
    <Card>
      <CardHeader title="New update available for the Outer Wilds Mod Manager" />
      <CardContent>
        Current version: {remote.app.getVersion()}
        <Button
          startIcon={<DownloadIcon />}
          color="primary"
          variant="contained"
        >
          Download update
        </Button>
        Downloading update...
        <LinearProgress
          style={{ height: 15, borderRadius: 5 }}
          variant="determinate"
          value={50}
        />
      </CardContent>
    </Card>
  );
};

export default UpdatePage;
