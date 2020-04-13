import React, { useCallback } from 'react';
import {
  Button,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import {
  MoreVert,
  SaveAlt,
  Delete,
  CheckBox,
  CheckBoxOutlineBlank,
  GitHub,
} from '@material-ui/icons';

import { shell } from 'electron';

import { useAppState } from '../AppState';
import {
  isInstalled,
  install,
  uninstall,
  update,
  isOutdated,
} from '../../services/mod-manager';
import { toggleEnabled } from '../../services/mod-enabler';

interface Props {
  mod: Mod;
}

type ModActionHandler = (mod: Mod) => Promise<void> | void;

const ModActions: React.FunctionComponent<Props> = ({ mod }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { setModIsLoading } = useAppState();

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isModInstalled = mod !== undefined && isInstalled(mod);
  const isModOutdated = isOutdated(mod);
  const isModInstallable = mod.downloadUrl !== undefined;
  const isModDownloadable = isModInstalled ? isModOutdated : isModInstallable;

  const modActionHandler = useCallback(
    (handler: ModActionHandler) => async () => {
      handleClose();
      if (mod !== undefined) {
        setModIsLoading(mod.uniqueName, true);
        await handler(mod);
        setModIsLoading(mod.uniqueName, false);
      }
    },
    [mod],
  );

  const handleOpenRepoClick = () => {
    handleClose();
    shell.openExternal(`https://github.com/${mod.repo}`);
  };

  const getEnableTooltip = () => {
    if (mod.isRequired) {
      return 'Required, can\'t disable';
    } else if (mod.isEnabled) {
      return 'Disable';
    } else {
      return 'Enable';
    }
  };

  const getInstallTooltip = () => {
    if (isModOutdated) {
      return `Update to ${mod.remoteVersion}`;
    } else if (isModInstalled) {
      return 'Already installed';
    } else {
      return 'Install';
    }
  };

  return (
    <>
      <Tooltip title={getEnableTooltip()}>
        <span>
          <Button
            disabled={!isModInstalled || mod.isRequired}
            onClick={modActionHandler(toggleEnabled)}
          >
            {mod.isEnabled ? <CheckBox /> : <CheckBoxOutlineBlank />}
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={getInstallTooltip()}>
        <span>
          <Button
            onClick={modActionHandler(isModOutdated ? update : install)}
            disabled={mod.downloadUrl === undefined || !isModDownloadable}
            variant={isModOutdated ? 'contained' : 'text'}
            color={isModOutdated ? 'secondary' : 'default'}
          >
            <SaveAlt />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="More...">
        <span>
          <Button onClick={handleMoreClick}>
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
        <MenuItem
          disabled={mod.repo === undefined}
          onClick={handleOpenRepoClick}
        >
          <ListItemIcon>
            <GitHub />
          </ListItemIcon>
          {mod.repo ? 'More info on GitHub' : 'No repository available'}
        </MenuItem>
        {!mod.isRequired && (
          <MenuItem
            disabled={!isModInstalled}
            onClick={modActionHandler(uninstall)}
          >
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            Unistall
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ModActions;
