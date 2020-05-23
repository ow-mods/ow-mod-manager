import React, { FunctionComponent } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ListItem } from '@material-ui/core';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
};

const SwitchInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
}) => {
  const handleSwitchClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    onChange(!value);
  };

  return (
    <ListItem disabled={disabled} button onClick={handleSwitchClick}>
      <FormControlLabel
        disabled={disabled}
        control={<Switch checked={value} />}
        label={label}
      />
    </ListItem>
  );
};

export default SwitchInput;
