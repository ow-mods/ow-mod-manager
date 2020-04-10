import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import ModActionsMenu from './ModActionsMenu';

type Props = {
  mod: Mod;
};

const ModTableRow: React.FunctionComponent<Props> = ({ mod }) => (
  <TableRow
    hover
      // onClick={() => handleClick(mod)}
    role="checkbox"
    tabIndex={-1}
    key={mod.uniqueName}
  >
    <TableCell padding="checkbox">
      <Checkbox />
    </TableCell>
    <TableCell>
      {mod.name}
    </TableCell>
    <TableCell>{mod.author}</TableCell>
    <TableCell>{mod.isLoading ? 'Loading...' : mod.localVersion}</TableCell>
    <TableCell>{mod.remoteVersion}</TableCell>
    <TableCell>{mod.downloadCount}</TableCell>
    <TableCell padding="none">
      <ModActionsMenu mod={mod} />
    </TableCell>
  </TableRow>
);

export default ModTableRow;
