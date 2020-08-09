import React, { FunctionComponent } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ListItem, Tooltip } from '@material-ui/core';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

const SwitchInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
  tooltip = '',
}) => {
  const handleSwitchClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    onChange(!value);
  };

  return (
    <Tooltip title={tooltip} placement="bottom">
      <ListItem disabled={disabled} button onClick={handleSwitchClick}>
        <FormControlLabel
          disabled={disabled}
          control={<Switch checked={value} />}
          label={label}
        />
      </ListItem>
    </Tooltip>
  );
};

export default SwitchInput;
