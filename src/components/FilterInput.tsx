import React, { useCallback } from 'react';
import {
  Input,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from '@material-ui/core';
import { Close as CloseIcon, Search as SearchIcon } from '@material-ui/icons';

import { globalText } from '../static-text';

type Props = {
  value: string;
  label: string;
  onChange: (value: string) => void;
};

const FilterInput: React.FunctionComponent<Props> = ({
  value,
  onChange,
  label,
}) => {
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
    <OutlinedInput
      margin="dense"
      onChange={handleChange}
      value={value}
      placeholder={label}
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

export default FilterInput;
