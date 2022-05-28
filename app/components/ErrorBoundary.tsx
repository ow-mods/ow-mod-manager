import { Box, Paper, Typography } from '@material-ui/core';

import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  stack: string;
  error: string;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: '', stack: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      stack: error.stack,
      error: error.message || `${error}`,
    };
  }

  render() {
    const {
      state: { error, stack },
      props: { children },
    } = this;

    if (error) {
      return (
        <Box margin={1}>
          <Paper>
            <Box px={2} maxHeight={150} overflow="hidden scroll">
              <code>
                <pre>{stack}</pre>
              </code>
            </Box>
          </Paper>
        </Box>
      );
    }

    return children;
  }
}
