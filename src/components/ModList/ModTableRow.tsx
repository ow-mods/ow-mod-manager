import React from 'react';
import { makeStyles, TableCell, TableRow, Chip } from '@material-ui/core';

import { isOutdated } from '../../services/mod-manager';
import ModActions from './ModActions';

type Props = {
  mod: Mod;
  isRequired?: boolean;
};

const useStyles = makeStyles({
  root: {
    opacity: 0.5,
    background: '#252525',
  },
});

const ModTableRow: React.FunctionComponent<Props> = ({
  mod,
  isRequired = false,
}) => {
  const classes = useStyles();

  return (
    <TableRow classes={isRequired ? classes : undefined} key={mod.uniqueName}>
      <TableCell>{mod.name}</TableCell>
      <TableCell>{mod.author}</TableCell>
      <TableCell>
        {mod.isLoading && 'Loading...'}
        {!mod.isLoading && mod.localVersion && (
          <Chip label={mod.localVersion} />
        )}
      </TableCell>
      <TableCell>
        {mod.remoteVersion && (
          <Chip
            color={isOutdated(mod) ? 'primary' : 'default'}
            label={mod.remoteVersion}
          />
        )}
      </TableCell>
      <TableCell>{mod.downloadCount}</TableCell>
      <TableCell padding="none">
        <ModActions mod={mod} isRequired={isRequired} />
      </TableCell>
    </TableRow>
  );
};

export default ModTableRow;
