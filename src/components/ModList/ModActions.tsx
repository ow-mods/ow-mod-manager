import React, { useCallback } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { IconButton, Tooltip } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import RemoveIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';

import { shell } from 'electron';

import { useAppState } from '../AppState';
import {
  isInstalled, install, uninstall, update,
} from '../../services/mod-manager';

interface Props {
  mod: Mod;
}

type ModActionHandler = (mod: Mod) => Promise<void>;

const ModActions: React.FunctionComponent<Props> = ({ mod }) => {
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

  const handleOpenRepoClick = () => {
    handleClose();
    shell.openExternal(`https://github.com/${mod.repo}`);
  };

  return (
    <>
      <Tooltip title="Enable">
        <span>
          <Checkbox disabled={!isModInstalled} />
        </span>
      </Tooltip>
      <Tooltip title={isModInstalled ? 'Update' : 'Install'}>
        <span>
          <IconButton
            onClick={modActionHandler(isModInstalled ? update : install)}
            disabled={mod.downloadUrl === undefined}
          >
            <SaveAltIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Uninstall">
        <span>
          <IconButton disabled={!isModInstalled} onClick={modActionHandler(uninstall)}>
            <RemoveIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="More...">
        <span>
          <IconButton onClick={handleModActionsClick}>
            <MoreIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={undefined}
        transitionDuration={0}
      >
        <MenuItem disabled={mod.repo === undefined} onClick={handleOpenRepoClick}>
          {mod.repo ? 'Open repository' : 'No repository available'}
        </MenuItem>
      </Menu>
    </>
  );
};

export default ModActions;
