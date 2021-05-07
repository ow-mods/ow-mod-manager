import React from 'react';
import {
  makeStyles,
  TableCell,
  TableRow,
  Chip,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { useRecoilValue } from 'recoil';
import { modsText } from '../../static-text';
import { isOutdated, isInstalled, isBroken } from '../../services';
import ModActions from './ModActions';
import { missingDependencyIdsState } from '../../store';

type Props = {
  mod: Mod;
};

const useStyles = makeStyles((theme) => ({
  brokenRow: {
    background: theme.palette.error.dark,
  },
  missingDependencyRow: {
    background: theme.palette.secondary.dark,
  },
  modDescription: {
    color: theme.palette.text.disabled,
  },
}));

const ModTableRow: React.FunctionComponent<Props> = ({ mod }) => {
  const styles = useStyles();
  const missingDependencyNames = useRecoilValue(missingDependencyIdsState(mod));

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
    if (missingDependencyNames.length > 0) {
      return styles.missingDependencyRow;
    }
    return undefined;
  };

  const getRowTooltip = () => {
    if (isBroken(mod)) {
      return modsText.modLoadError(mod.errors);
    }
    if (missingDependencyNames.length > 0) {
      return modsText.missingDependencyWarning(
        mod.name,
        missingDependencyNames.join(', ')
      );
    }
    return '';
  };

  return (
    <Tooltip title={getRowTooltip()}>
      <TableRow className={getClassName()} key={mod.uniqueName}>
        <TableCell>
          <Typography variant="subtitle1">
            {mod.name}
          </Typography>
          <Typography className={styles.modDescription} variant="caption">
            {mod.description}
          </Typography>
        </TableCell>
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
