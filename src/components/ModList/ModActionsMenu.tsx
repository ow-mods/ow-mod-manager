import React, { useCallback } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/MoreVert';

import { useAppState } from '../AppState';
import {
  isInstalled, isOutdated, install, uninstall, update,
} from '../../services/mod-manager';

interface Props {
  mod: Mod;
}

type ModActionHandler = (mod: Mod) => Promise<void>;

const TableToolbar: React.FunctionComponent<Props> = ({ mod }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { setAppState, addMod } = useAppState();

  const handleModActionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isModInstalled = mod !== undefined && isInstalled(mod);

  const modActionHandler = useCallback((handler: ModActionHandler) => async () => {
    handleClose();
    if (mod !== undefined) {
      addMod({
        ...mod,
        isLoading: true,
      });
      await handler(mod);
      addMod({
        ...mod,
        isLoading: false,
      });
    }
  }, [mod, setAppState]);

  return (
    <>
      <IconButton onClick={handleModActionsClick}>
        <SettingsIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={undefined}
        transitionDuration={0}
      >
        {!isModInstalled && (
          <>
            <MenuItem onClick={modActionHandler(install)}>Install</MenuItem>
          </>
        )}
        {isModInstalled && (
          <>
            <MenuItem onClick={modActionHandler(uninstall)}>Uninstall</MenuItem>
            <MenuItem onClick={modActionHandler(update)}>{isOutdated(mod) ? 'Update' : 'Force Update'}</MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default TableToolbar;
