import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  missingDependencyIdsState,
  addonModList,
  enabledModList,
  isFiltering,
  modIsLoadingState,
} from '../../store';

type Props = {
  mod: Mod;
};

const useStyles = makeStyles((theme) => ({
  brokenRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.error.dark,
    },
    backgroundColor: theme.palette.error.dark,
    modText: {
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.secondary.light,
    },
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
    transition: 'background-color 0.2s',
  },
  loading: {
    backgroundColor: theme.palette.grey[600],
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
  const isModOutdated = isOutdated(mod);
  const isModBroken = isBroken(mod);
  const addonMods = useRecoilValue(addonModList);
  const [isAddonsExpanded, setIsAddonsExpanded] = useState(false);
  const isAddon = mod.parent && !mod.localVersion;
  const enabledMods = useRecoilValue(enabledModList);
  const forceExpandAddons = useRecoilValue(isFiltering);
  const shouldExpandAddons = forceExpandAddons || isAddonsExpanded;
  const rowRef = useRef<HTMLTableRowElement>(null);
  const isLoading = useRecoilValue(modIsLoadingState(mod.uniqueName));

  useEffect(() => {
    if (!isLoading || !rowRef.current) return;

    rowRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [isLoading]);

  const addons = useMemo(
    () => addonMods.filter((addon) => addon.parent === mod.uniqueName),
    [addonMods, mod.uniqueName]
  );

  const conflictingMods = useMemo(
    () =>
      mod.conflicts && mod.conflicts.length > 0
        ? enabledMods
            .filter((enabledMod) =>
              mod.conflicts?.includes(enabledMod.uniqueName)
            )
            .map((enabledMod) => enabledMod.name)
        : [],
    [enabledMods, mod.conflicts]
  );

  const isModConflicting = mod.isEnabled && conflictingMods.length > 0;

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
    if (isModBroken || isModConflicting) {
      className += ` ${styles.brokenRow}`;
    } else if (isLoading) {
      className += ` ${styles.loading}`;
    } else if (missingDependencyNames.length > 0) {
      className += ` ${styles.missingDependencyRow}`;
    } else if (isAddon) {
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
    if (isModConflicting) {
      return modsText.conflictingModWarning(conflictingMods.join(', '));
    }
    return mod.description;
  };

  return (
    <>
      <TableRow className={getClassName()} key={mod.uniqueName} ref={rowRef}>
        <TableCell className={styles.tableCell}>
          <Box display="flex">
            {isAddon && (
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
              <Box
                color={
                  isModBroken || isModConflicting
                    ? theme.palette.secondary.light
                    : theme.palette.text.secondary
                }
              >
                <Typography className={styles.modText} variant="caption">
                  {getModText()}
                </Typography>
              </Box>
              {addons.length > 0 && !forceExpandAddons && (
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
                    {shouldExpandAddons ? <ExpandLess /> : <ExpandMore />}

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
      {shouldExpandAddons &&
        addons.map((addon) => (
          <ModTableRow key={addon.uniqueName} mod={addon} />
        ))}
    </>
  );
};

export default ModTableRow;
