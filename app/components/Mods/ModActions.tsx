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
  Replay as ReplayIcon,
} from '@material-ui/icons';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { modsText } from '../../static-text';
import {
  isInstalled,
  install,
  uninstall,
  update,
  isOutdated,
  openDirectory,
  openRepo,
  toggleEnabled,
  getLocalModsSync,
  installPrerelease,
} from '../../services';
import { localModList, settingsState } from '../../store';
import { useLoading } from '../../store/loading-state';

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

  const isModInstalled = mod !== undefined && isInstalled(mod);
  const isModOutdated = isOutdated(mod);
  const isModInstallable = mod.downloadUrl !== undefined;
  const isModDownloadable =
    !isLoading && (isModInstalled ? isModOutdated : isModInstallable);
  const isInstallHighlighted =
    !isLoading && (isModOutdated || (mod.isRequired && !isModInstalled));

  const handleActionError = (actionName: string, error: string) => {
    console.error('error in action', actionName, error);
    setLocalMods(getLocalModsSync(owmlPath));
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
              'install'
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
            onClick={modActionHandlerSync(openDirectory, 'directory open')}
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
        <MenuItem disabled={mod.isRequired}>
          <ListItemIcon>
            <ReplayIcon />
          </ListItemIcon>
          {modsText.actions.reinstall}
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
    </>
  );
};

export default ModActions;
