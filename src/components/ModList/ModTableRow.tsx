import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

import { isOutdated } from '../../services/mod-manager';
import ModActions from './ModActions';

type Props = {
  mod: Mod;
  isRequired?: boolean;
};

const ModTableRow: React.FunctionComponent<Props> = ({
  mod,
  isRequired = false,
}) => (
  <TableRow key={mod.uniqueName}>
    <TableCell>{mod.name}</TableCell>
    <TableCell>{mod.author}</TableCell>
    <TableCell>
      {mod.isLoading && 'Loading...'}
      {!mod.isLoading && mod.localVersion && <Chip label={mod.localVersion} />}
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

export default ModTableRow;
