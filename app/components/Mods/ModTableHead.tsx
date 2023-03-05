import React from 'react';
import {
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Box,
} from '@material-ui/core';
import {
  CheckBox as CheckBoxIcon,
  IndeterminateCheckBox as CheckBoxIndeterminateIcon,
  CheckBoxOutlineBlank as CheckBoxBlankIcon,
} from '@material-ui/icons';

import { isInstalled, setEnabled } from '../../services';

import { modsText } from '../../helpers/static-text';

type Props = {
  title: string;
  mods: Mod[];
};

const getEnableTooltip = (mods: Mod[]) => {
  if (mods.every((mod) => mod.isEnabled)) {
    return modsText.actions.disable;
  }
  if (mods.every((mod) => isInstalled(mod))) {
    return modsText.actions.enable;
  }
  return '';
};

const getCheckboxIcon = (mods: Mod[]) => {
  if (mods.every((mod) => mod.isEnabled)) {
    return <CheckBoxIcon />;
  }
  if (mods.some((mod) => mod.isEnabled)) {
    return <CheckBoxIndeterminateIcon />;
  }
  return <CheckBoxBlankIcon />;
};

const toggleAllMods = (mods: Mod[]) => {
  const enabled = !mods.every((mod) => mod.isEnabled);
  mods.forEach((mod) => {
    if (mod.isRequired) return;
    setEnabled(mod, enabled);
  });
};

const ModTableHead: React.FunctionComponent<Props> = ({ title, mods }) => (
  <TableHead>
    <TableRow>
      <TableCell>{title}</TableCell>
      <TableCell width="100px">{modsText.tableHead.downloadCount}</TableCell>
      <TableCell width="110px" align="center">
        {modsText.tableHead.version}
      </TableCell>
      <TableCell width="180px">
        <Box display="flex" justifyContent="space-between">
          <Tooltip title={getEnableTooltip(mods)}>
            <span>
              <IconButton
                size="small"
                disabled={
                  mods.every((mod) => !isInstalled(mod)) ||
                  mods.every((mod) => mod.isRequired)
                }
                onClick={() => toggleAllMods(mods)}
              >
                {getCheckboxIcon(mods)}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  </TableHead>
);

export default ModTableHead;
