import React from 'react';
import { Switch, Tooltip, FormLabel } from '@material-ui/core';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { alphaState } from '../../store';

const AlphaSwitch: React.FunctionComponent = () => {
  const setAlpha = useSetRecoilState(alphaState);
  const inAlphaMode = useRecoilValue(alphaState);
  return (
    <div>
      <Tooltip title="View the mods created for Outer Wilds Alpha.">
        <Switch checked={inAlphaMode} onClick={() => setAlpha(!inAlphaMode)} />
      </Tooltip>
      <FormLabel>View Outer Wilds Alpha Mods</FormLabel>
    </div>
  );
};

export default AlphaSwitch;
