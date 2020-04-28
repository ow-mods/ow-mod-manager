import React from 'react';
import { Button, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import {
  MoreVert as MoreIcon,
  SaveAlt as SaveIcon,
  Delete as DeleteIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckboxBlankIcon,
  GitHub as GitHubIcon,
  FolderOpen as FolderIcon,
} from '@material-ui/icons';

import { useAppState } from '../../hooks';
import {
  isInstalled,
  install,
  uninstall,
  update,
  isOutdated,
  openDirectory,
  openRepo,
  toggleEnabled,
} from '../../services';
import Tooltip from '../Tooltip';

interface Props {
  mod: Mod;
}

type ModActionHandler<Return> = (mod: Mod) => Return;

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
  const isInstallHighlighted =
    isModOutdated || (mod.isRequired && !isModInstalled);

  const modActionHandler = (
    handler: ModActionHandler<Promise<void> | void>,
  ) => async () => {
    handleClose();
    if (mod !== undefined) {
      setModIsLoading(mod.uniqueName, true);
      await handler(mod);
      setModIsLoading(mod.uniqueName, false);
    }
  };

  const modActionHandlerSync = (handler: ModActionHandler<void>) => () => {
    handleClose();
    handler(mod);
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
            {mod.isEnabled ? <CheckBoxIcon /> : <CheckboxBlankIcon />}
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={getInstallTooltip()}>
        <span>
          <Button
            onClick={modActionHandler(isModOutdated ? update : install)}
            disabled={mod.downloadUrl === undefined || !isModDownloadable}
            variant={isInstallHighlighted ? 'contained' : 'text'}
            color={isInstallHighlighted ? 'secondary' : 'default'}
          >
            <SaveIcon />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="More...">
        <span>
          <Button onClick={handleMoreClick}>
            <MoreIcon />
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
        {isModInstalled && (
          <MenuItem
            disabled={!isModInstalled}
            onClick={modActionHandlerSync(openDirectory)}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            Show in explorer
          </MenuItem>
        )}
        {mod.repo && (
          <MenuItem onClick={modActionHandlerSync(openRepo)}>
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            More info on GitHub
          </MenuItem>
        )}
        {!mod.isRequired && (
          <MenuItem
            disabled={!isModInstalled}
            onClick={modActionHandler(uninstall)}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            Uninstall
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ModActions;
