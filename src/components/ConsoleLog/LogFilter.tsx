import React, { useCallback } from 'react';
import { Input, InputAdornment, IconButton } from '@material-ui/core';
import { Close as CloseIcon, Search as SearchIcon } from '@material-ui/icons';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const LogFilter: React.FunctionComponent<Props> = ({ value, onChange }) => {
  const handleChange = useCallback(
    ({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
      onChange(currentTarget.value);
    },
    [onChange],
  );

  const handleClearClick = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <Input
      onChange={handleChange}
      value={value}
      placeholder="Find"
      color="secondary"
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      endAdornment={
        value !== '' && (
          <InputAdornment position="end">
            <IconButton onClick={handleClearClick} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }
    />
  );
};

export default LogFilter;
