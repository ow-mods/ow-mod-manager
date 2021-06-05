import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  ListItem,
  TextField,
  makeStyles,
  Button,
  Typography,
  Tooltip,
} from '@material-ui/core';

import { settingsText } from '../../helpers/static-text';
import { debugConsole } from '../../helpers/console-log';

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

const useStyles = makeStyles(({ spacing }) => ({
  textField: {
    margin: `${spacing(1)}px ${spacing(2)}px`,
    width: `calc(100% - ${2 * spacing(2)}px)`,
    flex: 1,
  },
}));

const TextInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
  tooltip = '',
}) => {
  const styles = useStyles();
  const [text, setText] = useState('');
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setText(event.target.value),
    []
  );
  const handleSaveClick = () => {
    onChange(text);
    setText(value);
  };

  useEffect(() => {
    debugConsole.log('useEffect: TextInput setText');
    setText(value);
  }, [value]);

  return (
    <ListItem>
      <Typography>{label}</Typography>
      <Tooltip title={tooltip} placement="bottom">
        <TextField
          className={styles.textField}
          variant="outlined"
          margin="dense"
          fullWidth
          value={text}
          onChange={handleChange}
          color="secondary"
          disabled={disabled}
        />
      </Tooltip>
      {value !== text && (
        <Button variant="contained" color="secondary" onClick={handleSaveClick}>
          {settingsText.textFieldSave}
        </Button>
      )}
    </ListItem>
  );
};

export default TextInput;
