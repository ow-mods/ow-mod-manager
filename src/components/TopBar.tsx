import React from 'react';
import { Button } from '@material-ui/core';
import runOwml from '../services/run-owml';

const style = {
  padding: '5px 25px',
  margin: '5px 15px 15px 0',
  color: 'white',
  backgroundColor: '#33cc33',
  fontSize: '20px',
};

export default function TopBar() {
  return (
    <span>
      <Button
        onClick={runOwml}
        style={style}
      >
        Play
      </Button>
    </span>
  );
}
