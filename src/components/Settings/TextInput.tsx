import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { ListItem, TextField, makeStyles, Button } from '@material-ui/core';

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
};

const useStyles = makeStyles(({ spacing }) => ({
  textField: {
    margin: `${spacing(1)}px 0`,
    width: `calc(100% - ${2 * spacing(2)}px)`,
    flex: 1,
  },
}));

const TextInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
}) => {
  const styles = useStyles();
  const [text, setText] = useState('');
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setText(event.target.value),
    [],
  );
  const handleSaveClick = () => {
    onChange(text);
  };

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <ListItem>
      <TextField
        className={styles.textField}
        fullWidth
        value={text}
        onChange={handleChange}
        color="secondary"
        disabled={disabled}
        label={label}
      />
      {value !== text && <Button onClick={handleSaveClick}>Save</Button>}
    </ListItem>
  );
};

export default TextInput;
