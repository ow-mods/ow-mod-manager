import React, { useState } from 'react';
import {
  Button,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import {
  MoreVert as MoreIcon,
  SaveAlt as SaveIcon,
  Delete as DeleteIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckboxBlankIcon,
  GitHub as GitHubIcon,
  FolderOpen as FolderIcon,
} from '@material-ui/icons';

import { modsText } from '../../static-text';
import { useAppState, useNotifications } from '../../hooks';
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

interface Props {
  mod: Mod;
}

type ModActionHandler<Return> = (
  mod: Mod,
  progressHandler: ProgressHandler,
) => Return;

type ModActionHandlerSync<Return> = (mod: Mod) => Return;

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    background: theme.palette.background.default,
    color: theme.palette.primary.main,
    borderRadius: '100%',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.palette.background.default,
    boxShadow: `0 0 5px 0 ${theme.palette.grey[300]}`,
  },
}));

const ModActions: React.FunctionComponent<Props> = ({ mod }) => {
  const styles = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { startLoading, endLoading } = useAppState();
  const { pushNotification } = useNotifications();

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isModInstalled = mod !== undefined && isInstalled(mod);
  const isModOutdated = isOutdated(mod);
  const isModInstallable = mod.downloadUrl !== undefined;
  const isModDownloadable =
    !isLoading && (isModInstalled ? isModOutdated : isModInstallable);
  const isInstallHighlighted =
    !isLoading && (isModOutdated || (mod.isRequired && !isModInstalled));

  const modActionHandler = (
    handler: ModActionHandler<Promise<void> | void>,
    actionName: string,
  ) => async () => {
    handleClose();
    if (mod !== undefined) {
      setIsLoading(true);
      startLoading();
      try {
        await handler(mod, setProgress);
      } catch (error) {
        pushNotification({
          message: modsText.actionError(actionName, error),
          severity: 'Error',
        });
      } finally {
        endLoading();
        setProgress(0);
        setIsLoading(false);
      }
    }
  };

  const modActionHandlerSync = (
    handler: ModActionHandlerSync<void>,
    actionName: string,
  ) => () => {
    handleClose();
    try {
      handler(mod);
    } catch (error) {
      pushNotification({
        message: modsText.actionError(actionName, error),
        severity: 'Error',
      });
    }
  };

  const getEnableTooltip = () => {
    if (mod.isRequired) {
      return modsText.actions.disableRequired;
    }
    if (mod.isEnabled) {
      return modsText.actions.disable;
    }
    if (isModInstalled) {
      return modsText.actions.enable;
    }
    return '';
  };

  const getInstallTooltip = () => {
    if (isLoading) {
      return modsText.actions.loading;
    }
    if (isModOutdated && mod.remoteVersion) {
      return modsText.actions.update(mod.remoteVersion);
    }
    if (isModInstalled) {
      return modsText.actions.alreadyInstalled;
    }
    return modsText.actions.install;
  };

  return (
    <>
      <Tooltip title={getEnableTooltip()}>
        <span>
          <Button
            disabled={!isModInstalled || mod.isRequired}
            onClick={modActionHandlerSync(toggleEnabled, 'enable toggle')}
          >
            {mod.isEnabled ? <CheckBoxIcon /> : <CheckboxBlankIcon />}
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={getInstallTooltip()}>
        <span>
          <Button
            onClick={modActionHandler(
              isModOutdated ? update : install,
              'install',
            )}
            disabled={!isModDownloadable}
            variant={isInstallHighlighted ? 'contained' : 'text'}
            color={isInstallHighlighted ? 'secondary' : 'default'}
          >
            {isLoading && (
              <CircularProgress
                variant="determinate"
                value={progress * 100}
                color="primary"
                size={24}
                thickness={23}
                className={styles.circularProgress}
              />
            )}
            {!isLoading && <SaveIcon />}
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={modsText.actions.more}>
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
            onClick={modActionHandlerSync(openDirectory, 'directory open')}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            {modsText.actions.openDirectory}
          </MenuItem>
        )}
        {mod.repo && (
          <MenuItem onClick={modActionHandlerSync(openRepo, 'repo open')}>
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            {modsText.actions.openRepo}
          </MenuItem>
        )}
        {!mod.isRequired && (
          <MenuItem
            disabled={!isModInstalled}
            onClick={modActionHandlerSync(uninstall, 'uninstall')}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            {modsText.actions.uninstall}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ModActions;
