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
import { isEnabled, toggleEnabled } from '../../services/mod-enabler';

interface Props {
  mod: Mod;
  isRequired?: boolean;
}

type ModActionHandler = (mod: Mod) => Promise<void> | void;

const ModActions: React.FunctionComponent<Props> = ({
  mod,
  isRequired = false,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { addMod } = useAppState();

  const handleModActionsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isModInstalled = mod !== undefined && isInstalled(mod);
  const isModOutdated = isOutdated(mod);
  const isModInstallable = mod.downloadUrl !== undefined;
  const isModDownloadable = isModInstalled ? isModOutdated : isModInstallable;
  const isModEnabled = isModInstalled && (isRequired || isEnabled(mod));

  const modActionHandler = useCallback(
    (handler: ModActionHandler) => async () => {
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
    },
    [mod],
  );

  const handleOpenRepoClick = () => {
    handleClose();
    shell.openExternal(`https://github.com/${mod.repo}`);
  };

  return (
    <>
      <Tooltip title={isModEnabled ? 'Disable' : 'Enable'}>
        <span>
          <Button
            disabled={!isModInstalled || isRequired}
            onClick={modActionHandler(toggleEnabled)}
          >
            {isModEnabled ? <CheckBox /> : <CheckBoxOutlineBlank />}
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
        <MenuItem
          disabled={mod.repo === undefined}
          onClick={handleOpenRepoClick}
        >
          <ListItemIcon>
            <GitHub />
          </ListItemIcon>
          {mod.repo ? 'More info on GitHub' : 'No repository available'}
        </MenuItem>
        {!isRequired && (
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
