import React from 'react';
import { Button } from '@material-ui/core';
import runOwml from '../services/run-owml';

export default function TopBar() {
  return (
    <div>
      <Button
        onClick={runOwml}
        size="large"
        variant="contained"
        color="primary"
      >
        Start Game
      </Button>
    </div>
  );
}
