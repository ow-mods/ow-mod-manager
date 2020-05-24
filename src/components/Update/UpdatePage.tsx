import React, { useCallback, useState } from 'react';
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
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadUpdateClick = useCallback(() => {
    const updateApp = async () => {
      setIsDownloading(true);
      try {
        await downloadAppUpdate((newProgress) => {
          setProgress(newProgress);
        });
      } finally {
        setIsDownloading(false);
        setProgress(0);
      }
    };

    updateApp();
  }, []);

  return (
    <Card>
      <CardHeader title="New update available for the Outer Wilds Mod Manager" />
      <CardContent>
        {!isDownloading && (
          <Button
            startIcon={<DownloadIcon />}
            color="primary"
            variant="contained"
            onClick={handleDownloadUpdateClick}
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
