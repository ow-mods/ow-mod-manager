import React, { useState } from 'react';
import {
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
  makeStyles,
  IconButton,
  Box,
} from '@material-ui/core';
import {
  MoreVert as MoreIcon,
  SaveAlt as SaveIcon,
  Delete as DeleteIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckboxBlankIcon,
  GitHub as GitHubIcon,
  FolderOpen as FolderIcon,
  Update as UpdateIcon,
  Description as DescriptionIcon,
} from '@material-ui/icons';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { modsText } from '../../helpers/static-text';
import {
  isInstalled,
  install,
  uninstall,
  isOutdated,
  openModDirectory,
  openRepo,
  toggleEnabled,
  getLocalMods,
  installPrerelease,
  isBroken,
  reinstall,
  openReadme,
} from '../../services';
import { localModList, settingsState } from '../../store';
import { useLoading } from '../../store/loading-state';
import { debugConsole } from '../../helpers/console-log';

interface Props {
  mod: Mod;
}

type ModActionHandler<Return> = (
  mod: Mod,
  progressHandler: ProgressHandler
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
  highlightedButton: {
    color: theme.palette.secondary.light,
    boxShadow: `0 0 10px ${theme.palette.common.white}`,
  },
}));

const ModActions: React.FunctionComponent<Props> = ({ mod }) => {
  const styles = useStyles();
  const setLocalMods = useSetRecoilState(localModList);
  const { owmlPath } = useRecoilValue(settingsState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { startLoading, endLoading } = useLoading();

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isModBroken = isBroken(mod);
  const isModInstalled = mod !== undefined && isInstalled(mod);
  const isModOutdated = isOutdated(mod);
  const isModInstallable = mod.downloadUrl !== undefined;
  const isModDownloadable =
    !isLoading &&
    isModInstallable &&
    (!isModInstalled || isModBroken || isModOutdated);
  const isInstallHighlighted =
    !isLoading &&
    !isModBroken &&
    (isModOutdated || (mod.isRequired && !isModInstalled));

  const handleActionError = (actionName: string, error: string) => {
    debugConsole.error('error in action', actionName, error);
    setLocalMods(getLocalMods(owmlPath));
  };

  const modActionHandler = (
    handler: ModActionHandler<Promise<void> | void>,
    actionName: string
  ) => async () => {
    handleClose();
    if (mod !== undefined) {
      setIsLoading(true);
      startLoading();
      try {
        await handler(mod, setProgress);
      } catch (error) {
        handleActionError(actionName, error);
      } finally {
        setProgress(0);
        setIsLoading(false);
        endLoading();
      }
    }
  };

  const modActionHandlerSync = (
    handler: ModActionHandlerSync<void>,
    actionName: string
  ) => () => {
    handleClose();
    try {
      handler(mod);
    } catch (error) {
      handleActionError(actionName, error);
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
    if (isModBroken) {
      return mod.remoteVersion
        ? modsText.actions.reinstall
        : modsText.actions.cantReinstall;
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
    <Box display="flex" justifyContent="space-between">
      <Tooltip title={getEnableTooltip()}>
        <span>
          <IconButton
            size="small"
            disabled={!isModInstalled || mod.isRequired}
            onClick={modActionHandlerSync(toggleEnabled, 'enable toggle')}
          >
            {mod.isEnabled ? <CheckBoxIcon /> : <CheckboxBlankIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={getInstallTooltip()}>
        <span>
          <IconButton
            onClick={modActionHandler(
              isModBroken ? reinstall : install,
              'install'
            )}
            disabled={!isModDownloadable}
            size="small"
            className={isInstallHighlighted ? styles.highlightedButton : ''}
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
            {!isLoading && (isModOutdated ? <UpdateIcon /> : <SaveIcon />)}
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={modsText.actions.readme}>
        <span>
          <IconButton
            disabled={!mod.repo}
            size="small"
            onClick={modActionHandlerSync(openReadme, 'repo open')}
          >
            <DescriptionIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={modsText.actions.more}>
        <span>
          <IconButton size="small" onClick={handleMoreClick}>
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
        {mod.prerelease && (
          <MenuItem
            disabled={mod.localVersion === mod.prerelease.version}
            onClick={modActionHandler(installPrerelease, 'install prerelease')}
          >
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            {modsText.actions.installPrerelease(mod.prerelease.version)}
          </MenuItem>
        )}
        {isModInstalled && (
          <MenuItem
            disabled={!isModInstalled}
            onClick={modActionHandlerSync(openModDirectory, 'directory open')}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            {modsText.actions.openDirectory}
          </MenuItem>
        )}
        <MenuItem
          disabled={!mod.repo}
          onClick={modActionHandlerSync(openRepo, 'repo open')}
        >
          <ListItemIcon>
            <GitHubIcon />
          </ListItemIcon>
          {modsText.actions.openRepo}
        </MenuItem>
        <MenuItem
          disabled={mod.isRequired || !isModInstalled}
          onClick={modActionHandlerSync(uninstall, 'uninstall')}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          {modsText.actions.uninstall}
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ModActions;
