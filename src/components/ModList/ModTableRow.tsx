import React from 'react';
import {
  makeStyles,
  TableCell,
  TableRow,
  Chip,
  CircularProgress,
  PropTypes as MaterialProps,
} from '@material-ui/core';

import { isOutdated, isInstalled } from '../../services/mod-manager';
import ModActions from './ModActions';

type Props = {
  mod: Mod;
};

const useStyles = makeStyles({
  root: {
    opacity: 0.75,
    background: '#252525',
  },
});

const ModTableRow: React.FunctionComponent<Props> = ({ mod }) => {
  const classes = useStyles();

  const getVersionColor = (): MaterialProps.Color => {
    if (isOutdated(mod)) {
      return 'secondary';
    } else if (isInstalled(mod)) {
      return 'primary';
    } else {
      return 'default';
    }
  };

  const getVersion = () => {
    if (isInstalled(mod)) {
      return mod.localVersion;
    } else {
      return mod.remoteVersion;
    }
  };

  return (
    <TableRow
      classes={mod.isRequired ? classes : undefined}
      key={mod.uniqueName}
    >
      <TableCell>{mod.name}</TableCell>
      <TableCell>{mod.author}</TableCell>
      <TableCell align="right">{mod.downloadCount}</TableCell>
      <TableCell>
        {mod.isLoading && (
          <Chip
            label="Loading..."
            icon={<CircularProgress size={20} color="inherit" />}
          />
        )}
        {!mod.isLoading && (
          <Chip color={getVersionColor()} label={getVersion()} />
        )}
      </TableCell>
      <TableCell padding="none">
        <ModActions mod={mod} />
      </TableCell>
    </TableRow>
  );
};

export default ModTableRow;
