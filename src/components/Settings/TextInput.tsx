import React, { FunctionComponent, useCallback } from 'react';
import {
  ListItem,
  Typography,
  TextField,
  ListItemText,
} from '@material-ui/core';

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const TextInput: FunctionComponent<Props> = ({ value, onChange, label }) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    [onChange],
  );

  return (
    <ListItem>
      <ListItemText>
        <Typography>{label}</Typography>
        <TextField
          fullWidth
          value={value}
          onChange={handleChange}
          color="secondary"
          variant="outlined"
        />
      </ListItemText>
    </ListItem>
  );
};

export default TextInput;
