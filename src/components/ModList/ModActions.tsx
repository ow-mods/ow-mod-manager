import React, { useCallback } from 'react';
import {
  Button,
  Tooltip,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  MoreVert,
  SaveAlt,
  Delete,
  CheckBox,
  CheckBoxOutlineBlank,
} from '@material-ui/icons';

import { shell } from 'electron';

import { useAppState } from '../AppState';
import {
  isInstalled, install, uninstall, update, isOutdated,
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
  const isModOutdated = isOutdated(mod);
  const isModInstallable = mod.downloadUrl !== undefined;
  const isModDownloadable = isModInstalled ? isModOutdated : isModInstallable;

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
      <Tooltip title={isModInstalled ? 'Disable' : 'Enable'}>
        <span>
          <Button>
            {isModInstalled ? (
              <CheckBox />
            ) : (
              <CheckBoxOutlineBlank />
            )}
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={isModOutdated ? 'Update' : 'Install'}>
        <span>
          <Button
            onClick={modActionHandler(isModOutdated ? update : install)}
            disabled={mod.downloadUrl === undefined || !isModDownloadable}
            variant={isModOutdated ? 'contained' : 'text'}
            color={isModOutdated ? 'primary' : 'default'}
          >
            <SaveAlt />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="Uninstall">
        <span>
          <Button
            disabled={!isModInstalled}
            onClick={modActionHandler(uninstall)}
          >
            <Delete />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="More...">
        <span>
          <Button onClick={handleModActionsClick}>
            <MoreVert />
          </Button>
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
