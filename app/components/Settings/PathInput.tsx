import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { remote } from 'electron';
import fs from 'fs-extra';
import {
  ListItem,
  TextField,
  makeStyles,
  Button,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { Save as SaveIcon, Folder as FolderIcon } from '@material-ui/icons';
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

const PathInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
  tooltip = '',
}) => {
  const styles = useStyles();
  const [path, setPath] = useState('');
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setPath(event.target.value),
    []
  );
  const savePath = useCallback(
    (newPath: string) => {
      try {
        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath, { recursive: true });
        }
        onChange(newPath);
        setPath(newPath);
      } catch (error) {
        debugConsole.error(`Error setting path in PathInput`, error);
        onChange('');
        setPath('');
      }
    },
    [onChange]
  );
  const handleSaveClick = () => {
    savePath(path);
  };

  useEffect(() => {
    debugConsole.log('useEffect: PathInput set path');
    setPath(value);
  }, [value]);

  const handleFindClick = async () => {
    try {
      const openedValue = await remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: settingsText.pathFindTitle,
        defaultPath: value,
      });
      if (openedValue && openedValue.canceled === false) {
        const pathResult = openedValue.filePaths[0];
        savePath(pathResult);
      }
    } catch (err) {
      debugConsole.error(err);
    }
  };

  return (
    <ListItem>
      <Typography>{label}</Typography>
      <Tooltip title={tooltip} placement="bottom">
        <TextField
          className={styles.textField}
          variant="outlined"
          margin="dense"
          fullWidth
          value={path}
          onChange={handleChange}
          color="secondary"
          disabled={disabled}
        />
      </Tooltip>
      {value !== path && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSaveClick}
          startIcon={<SaveIcon />}
        >
          {settingsText.textFieldSave}
        </Button>
      )}
      {value === path && (
        <Button
          variant="contained"
          onClick={handleFindClick}
          startIcon={<FolderIcon />}
        >
          {settingsText.pathFindButton}
        </Button>
      )}
    </ListItem>
  );
};

export default PathInput;
