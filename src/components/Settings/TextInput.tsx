import React, { FunctionComponent, useCallback } from 'react';
import { ListItem, Typography, TextField, makeStyles } from '@material-ui/core';

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
};

const useStyles = makeStyles(({ spacing }) => ({
  textField: {
    margin: `${spacing(1)}px ${spacing(2)}px`,
    width: `calc(100% - ${2 * spacing(2)}px)`,
    flex: 1,
  },
}));

const TextInput: FunctionComponent<Props> = ({ value, onChange, label }) => {
  const styles = useStyles();
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    [onChange],
  );

  return (
    <ListItem>
      <Typography>{label}</Typography>
      <TextField
        className={styles.textField}
        fullWidth
        value={value}
        onChange={handleChange}
        color="secondary"
      />
    </ListItem>
  );
};

export default TextInput;
