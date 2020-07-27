import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { remote } from 'electron';
import {
  ListItem,
  TextField,
  makeStyles,
  Button,
  Typography,
  Tooltip,
} from '@material-ui/core';

import { settingsText } from '../../static-text';

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

const FILE_NAME = 'OuterWilds.exe';

const PathInput: FunctionComponent<Props> = ({
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
    [],
  );
  const handleSaveClick = () => {
    onChange(text);
  };

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleFindClick = async () => {
    const openedValue = await remote.dialog.showOpenDialog({
      properties: ['openFile'],
      title: settingsText.pathFindTitle(FILE_NAME),
      defaultPath: `${value}\\${FILE_NAME}`,
      filters: [
        {
          name: FILE_NAME,
          extensions: ['exe'],
        },
      ],
    });

    const path = openedValue.filePaths[0].replace(FILE_NAME, '');
    onChange(path);
    setText(path);
  };

  return (
    <ListItem>
      <Typography>{label}</Typography>
      <Tooltip title={tooltip} placement="bottom">
        <TextField
          className={styles.textField}
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
      {value === text && (
        <Button variant="contained" onClick={handleFindClick}>
          {settingsText.pathFindButton}
        </Button>
      )}
    </ListItem>
  );
};

export default PathInput;
