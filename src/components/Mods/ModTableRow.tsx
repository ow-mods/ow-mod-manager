import React from 'react';
import {
  makeStyles,
  TableCell,
  TableRow,
  Chip,
  Tooltip,
} from '@material-ui/core';

import { modsText } from '../../static-text';
import { useAppState } from '../../hooks';
import {
  isOutdated,
  isInstalled,
  isBroken,
  isModDependencyMissing,
} from '../../services';
import ModActions from './ModActions';

type Props = {
  mod: Mod;
};

const useStyles = makeStyles((theme) => ({
  brokenRow: {
    background: theme.palette.error.dark,
  },
  missingDependencyRow: {
    background: theme.palette.warning.dark,
  },
}));

const ModTableRow: React.FunctionComponent<Props> = ({ mod }) => {
  const styles = useStyles();
  const { modMap } = useAppState();

  const isDependencyMissing = isModDependencyMissing(modMap, mod);

  const getVersionColor = () => {
    if (isOutdated(mod)) {
      return 'secondary';
    }
    if (isInstalled(mod)) {
      return 'primary';
    }
    return 'default';
  };

  const getVersion = () => {
    if (isInstalled(mod)) {
      return mod.localVersion;
    }
    if (mod.remoteVersion) {
      return mod.remoteVersion;
    }
    return modsText.versionNotAvailable;
  };

  const getClassName = () => {
    if (isBroken(mod)) {
      return styles.brokenRow;
    }
    if (isDependencyMissing) {
      return styles.missingDependencyRow;
    }
    return undefined;
  };

  const getRowTooltip = () => {
    if (isBroken(mod)) {
      return modsText.modLoadError(mod.errors);
    }
    if (isDependencyMissing) {
      return modsText.missingDependencyWarning(mod.name, mod.dependencies);
    }
    return '';
  };

  return (
    <Tooltip title={getRowTooltip()}>
      <TableRow className={getClassName()} key={mod.uniqueName}>
        <TableCell>{mod.name}</TableCell>
        <TableCell>{mod.author}</TableCell>
        <TableCell align="right">{mod.downloadCount}</TableCell>
        <TableCell>
          <Chip color={getVersionColor()} label={getVersion()} />
        </TableCell>
        <TableCell padding="none">
          <ModActions mod={mod} />
        </TableCell>
      </TableRow>
    </Tooltip>
  );
};

export default ModTableRow;
