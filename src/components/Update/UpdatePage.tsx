import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';

const UpdatePage: React.FunctionComponent = () => {
  return (
    <Card>
      <CardHeader title="New update available for the Outer Wilds Mod Manager" />
      <CardContent>
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
