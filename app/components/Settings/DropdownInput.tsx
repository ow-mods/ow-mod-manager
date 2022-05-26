import React, { FunctionComponent } from 'react';
import {
  ListItem,
  Select,
  Tooltip,
  MenuItem,
  Typography,
  Box,
} from '@material-ui/core';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

const DropdownInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
  tooltip = '',
}) => {
  const [mainLabel, falseLabel, trueLabel] = label.split('|');

  return (
    <Tooltip title={tooltip} placement="bottom">
      <ListItem disabled={disabled}>
        <Box mr={2}>
          <Typography>{mainLabel}</Typography>
        </Box>
        <Select
          variant="outlined"
          margin="dense"
          color="secondary"
          value={value ? 'true' : 'false'}
          onChange={(event) => {
            event.preventDefault();
            onChange(event.target.value === 'true');
          }}
        >
          <MenuItem value="false">{falseLabel}</MenuItem>
          <MenuItem value="true">{trueLabel}</MenuItem>
        </Select>
      </ListItem>
    </Tooltip>
  );
};

export default DropdownInput;
