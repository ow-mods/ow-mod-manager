import React from 'react';
import {
  makeStyles,
  TableCell,
  TableRow,
  Chip,
  Tooltip,
  Typography,
  Box,
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
  mutedText: {
    color: theme.palette.text.disabled,
  },
  tableCell: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderBottom: 0,
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#4b4b4b',
    },
  },
  versionChip: {
    width: '100%',
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
    '& span': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  modDescription: {
    display: 'block',
    marginTop: -5,
    marginBottom: -theme.spacing(0),
  },
  outdatedChip: {
    ...theme.typography.caption,
    textAlign: 'center',
    width: '100%',
    lineHeight: 0,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    marginTop: -theme.spacing(4),
    borderRadius: 16,
    background: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const ModTableRow: React.FunctionComponent<Props> = ({ mod }) => {
  const styles = useStyles();
  const missingDependencyNames = useRecoilValue(missingDependencyIdsState(mod));
  const isModOutdated = isOutdated(mod);

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
    let className = styles.tableRow;
    if (isBroken(mod)) {
      className += ` ${styles.brokenRow}`;
    } else if (missingDependencyNames.length > 0) {
      className += ` ${styles.missingDependencyRow}`;
    }
    return className;
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
        <TableCell className={styles.tableCell}>
          <Typography variant="subtitle1">
            {mod.name}
            <Box ml={2} display="inline-block">
              <Typography className={styles.mutedText} variant="caption">
                {' by '}
                {mod.author}
              </Typography>
              <Typography variant="caption" />
            </Box>
          </Typography>
          <Typography
            className={styles.modDescription}
            color="textSecondary"
            variant="caption"
          >
            {mod.description}
          </Typography>
        </TableCell>
        <TableCell className={styles.tableCell} align="right">
          {mod.downloadCount || '-'}
        </TableCell>
        <TableCell className={styles.tableCell}>
          <Chip
            color={getVersionColor()}
            label={getVersion()}
            className={styles.versionChip}
          />
          {isModOutdated && (
            <div className={styles.outdatedChip}>{modsText.outdated}</div>
          )}
        </TableCell>
        <TableCell className={styles.tableCell}>
          <ModActions mod={mod} />
        </TableCell>
      </TableRow>
    </Tooltip>
  );
};

export default ModTableRow;
