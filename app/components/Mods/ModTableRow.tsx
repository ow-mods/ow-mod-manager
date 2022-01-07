import React, { useMemo, useState } from 'react';
import {
  makeStyles,
  TableCell,
  TableRow,
  Chip,
  Typography,
  Box,
  useTheme,
  ButtonBase,
} from '@material-ui/core';

import { useRecoilValue } from 'recoil';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { modsText } from '../../helpers/static-text';
import { isOutdated, isInstalled, isBroken } from '../../services';
import ModActions from './ModActions';
import { missingDependencyIdsState, addonModList } from '../../store';

type Props = {
  mod: Mod;
};

const useStyles = makeStyles((theme) => ({
  brokenRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.error.dark,
    },
    backgroundColor: theme.palette.error.dark,
  },
  missingDependencyRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.secondary.dark,
    },
    backgroundColor: theme.palette.secondary.dark,
  },
  modAuthor: {
    color: theme.palette.text.disabled,
    display: 'inline-block',
  },
  tableCell: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      opacity: '#4b4b4b',
    },
  },
  addonRow: {
    backgroundColor: theme.palette.grey[900],
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
  modText: {
    display: 'block',
    marginTop: -5,
    marginBottom: -theme.spacing(0),
    wordWrap: 'break-word',
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
  addonExpander: {
    width: '100%',
    justifyContent: 'start',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    transition: `${theme.transitions.duration.shortest}ms`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const ModTableRow: React.FunctionComponent<Props> = ({ mod }) => {
  const styles = useStyles();
  const theme = useTheme();
  const missingDependencyNames = useRecoilValue(missingDependencyIdsState(mod));
  const isModBroken = isBroken(mod);
  const isModOutdated = isOutdated(mod);
  const addonMods = useRecoilValue(addonModList);
  const [isAddonsExpanded, setIsAddonsExpanded] = useState(false);

  const addons = useMemo(
    () => addonMods.filter((addon) => addon.parent === mod.uniqueName),
    [addonMods, mod.uniqueName]
  );

  const handleExpandClick = () =>
    setIsAddonsExpanded((isExpanded) => !isExpanded);

  const getVersionColor = () => {
    if (isModBroken) {
      return 'default';
    }
    if (isModOutdated) {
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
    if (isModBroken) {
      className += ` ${styles.brokenRow}`;
    } else if (missingDependencyNames.length > 0) {
      className += ` ${styles.missingDependencyRow}`;
    } else if (mod.parent) {
      className += ` ${styles.addonRow}`;
    }
    return className;
  };

  const getModText = () => {
    if (isModBroken) {
      return modsText.modLoadError(mod.errors);
    }
    if (missingDependencyNames.length > 0) {
      return modsText.missingDependencyWarning(
        missingDependencyNames.join(', ')
      );
    }
    return mod.description;
  };

  return (
    <>
      <TableRow className={getClassName()} key={mod.uniqueName}>
        <TableCell className={styles.tableCell}>
          <Box display="flex">
            {mod.parent && (
              <Box
                bgcolor={theme.palette.background.paper}
                width="8px"
                minWidth="8px"
                marginRight={2}
                marginLeft={1}
                borderRadius="8px"
              />
            )}
            <Box width="100%">
              <Typography variant="subtitle1">
                <Box display="inline-block" mr={2}>
                  {mod.name}
                </Box>
                <Typography className={styles.modAuthor} variant="caption">
                  {' by '}
                  {mod.author}
                </Typography>
                <Typography variant="caption" />
              </Typography>
              <Typography
                className={styles.modText}
                color="textSecondary"
                variant="caption"
              >
                {getModText()}
              </Typography>
              {addons.length > 0 && (
                <ButtonBase
                  className={styles.addonExpander}
                  onClick={handleExpandClick}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    borderRadius={theme.shape.borderRadius}
                    maxWidth="100%"
                  >
                    {isAddonsExpanded ? <ExpandLess /> : <ExpandMore />}

                    <Typography variant="caption" noWrap>
                      {addons.length}
                      {' addons available: '}
                      {addons.map((addon) => addon.name).join(', ')}
                    </Typography>
                  </Box>
                </ButtonBase>
              )}
            </Box>
          </Box>
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
          {!isModBroken && isModOutdated && (
            <div className={styles.outdatedChip}>{modsText.outdated}</div>
          )}
        </TableCell>
        <TableCell className={styles.tableCell}>
          <ModActions mod={mod} />
        </TableCell>
      </TableRow>
      {isAddonsExpanded &&
        addons.map((addon) => (
          <ModTableRow key={addon.uniqueName} mod={addon} />
        ))}
    </>
  );
};

export default ModTableRow;
