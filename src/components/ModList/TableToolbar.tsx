import React, { useCallback } from 'react';
import {
  createStyles, lighten, makeStyles, Theme,
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';

import { useAppState } from '../AppState';
import {
  isInstalled, isOutdated, install, uninstall, update,
} from '../../services/mod-manager';

interface Props {
  selectedMod?: Mod;
}

type ModActionHandler = (mod: Mod) => Promise<void>;

const useToolbarStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const TableToolbar = (props: Props) => {
  const { setAppState } = useAppState();
  const classes = useToolbarStyles();
  const { selectedMod: selected } = props;

  const isModInstalled = selected !== undefined && isInstalled(selected);

  const modActionHandler = useCallback((handler: ModActionHandler) => async () => {
    if (selected !== undefined) {
      await handler(selected);
      setAppState({ isLocalModsDirty: true });
    }
  }, [selected, setAppState]);

  return (
    <Toolbar className={`${classes.root} ${selected !== undefined ? classes.highlight : ''}`}>
      {selected !== undefined ? (
        <ButtonGroup
          variant="outlined"
          color="primary"
        >
          {isModInstalled && (
          <Button onClick={modActionHandler(uninstall)}>
            Uninstall
          </Button>
          )}
          {!isModInstalled && (
          <Button onClick={modActionHandler(install)}>
            Install
          </Button>
          )}
          {isOutdated(selected) && (
          <Button onClick={modActionHandler(update)}>
            Update
          </Button>
          )}
        </ButtonGroup>
      ) : (
        <Button
          fullWidth
          color="primary"
          variant="contained"
        >
          Update all
        </Button>
      )}
    </Toolbar>
  );
};

export default TableToolbar;
