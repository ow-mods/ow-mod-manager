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
  ) => async () => {
    handleClose();
    if (mod !== undefined) {
      setIsLoading(true);
      startLoading();
      await handler(mod, setProgress);
      endLoading();
      setProgress(0);
      setIsLoading(false);
    }
  };

  const modActionHandlerSync = (handler: ModActionHandlerSync<void>) => () => {
    handleClose();
    handler(mod);
  };

  const getEnableTooltip = () => {
    if (mod.isRequired) {
      return 'Required, can\'t disable';
    }
    if (mod.isEnabled) {
      return 'Disable';
    }
    if (isModInstalled && !mod.isBroken) {
      return 'Enable';
    }
    return '';
  };

  const getInstallTooltip = () => {
    if (isLoading) {
      return 'Loading...';
    }
    if (isModOutdated) {
      return `Update to ${mod.remoteVersion}`;
    }
    if (isModInstalled) {
      return 'Already installed';
    }
    return 'Install';
  };

  return (
    <>
      <Tooltip title={getEnableTooltip()}>
        <span>
          <Button
            disabled={!isModInstalled || mod.isRequired || mod.isBroken}
            onClick={modActionHandlerSync(toggleEnabled)}
          >
            {mod.isEnabled ? <CheckBoxIcon /> : <CheckboxBlankIcon />}
          </Button>
        </span>
      </Tooltip>
      <Tooltip title={getInstallTooltip()}>
        <span>
          <Button
            onClick={modActionHandler(isModOutdated ? update : install)}
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
            onClick={modActionHandlerSync(uninstall)}
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
