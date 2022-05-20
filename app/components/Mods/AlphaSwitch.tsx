import React from 'react';
import { Switch, Tooltip, FormLabel } from '@material-ui/core';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { alphaState } from '../../store';

const AlphaSwitch: React.FunctionComponent = () => {
    const setAlpha = useSetRecoilState(alphaState);
    const alpha = useRecoilValue(alphaState);
    return (
        <div>
            <Tooltip title={'View the mods created for Outer Wilds Alpha.'}>
                <Switch 
                    checked={alpha}
                    onClick={() => setAlpha(!alpha)}/>
            </Tooltip>
            <FormLabel>
                {'View Outer Wilds Alpha Mods'}
            </FormLabel>
        </div>
    );
};

export default AlphaSwitch;