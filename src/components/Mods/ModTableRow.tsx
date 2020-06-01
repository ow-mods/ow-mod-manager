import React from 'react';
import {
  makeStyles,
  TableCell,
  TableRow,
  Chip,
  PropTypes as MaterialProps,
  Tooltip,
} from '@material-ui/core';

import { isOutdated, isInstalled, isBroken } from '../../services';
import ModActions from './ModActions';

type Props = {
  mod: Mod;
};

const useStyles = makeStyles((theme) => ({
  requiredRow: {
    background: theme.palette.background.default,
  },
  brokenRow: {
    background: theme.palette.error.dark,
  },
}));

const ModTableRow: React.FunctionComponent<Props> = ({ mod }) => {
  const styles = useStyles();

  const getVersionColor = (): MaterialProps.Color => {
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
    return 'Not Available';
  };

  const getClassName = () => {
    if (mod.isRequired) {
      return styles.requiredRow;
    }
    if (isBroken(mod)) {
      return styles.brokenRow;
    }
    return undefined;
  };

  const getRowTooltip = () => {
    if (isBroken(mod)) {
      return `Failed to load mod. Errors: ${mod.errors.join(' || ')}`;
    }
    return '';
  };

  return (
    <Tooltip title={getRowTooltip()}>
      <TableRow
        className={getClassName()}
        key={mod.uniqueName}
        data-testid={`mod-row-${mod.uniqueName}`}
      >
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
