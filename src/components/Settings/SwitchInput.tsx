import React, { FunctionComponent } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ListItem } from '@material-ui/core';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

const SwitchInput: FunctionComponent<Props> = ({ value, onChange, label }) => {
  const handleSwitchClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    onChange(!value);
  };

  return (
    <ListItem button onClick={handleSwitchClick}>
      <FormControlLabel control={<Switch checked={value} />} label={label} />
    </ListItem>
  );
};

export default SwitchInput;
