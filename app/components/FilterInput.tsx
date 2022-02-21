import React, { useState, useEffect } from 'react';
import { InputAdornment, IconButton, OutlinedInput } from '@material-ui/core';
import { Close as CloseIcon, Search as SearchIcon } from '@material-ui/icons';
import { useDebounce } from '../hooks/use-debounce';

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
  const [filterText, setFilterText] = useState(value);
  const debouncedFilterText = useDebounce(filterText, 200);

  useEffect(() => {
    onChange(debouncedFilterText);
  }, [debouncedFilterText, onChange]);

  return (
    <OutlinedInput
      margin="dense"
      onChange={({ currentTarget }) => {
        setFilterText(currentTarget.value);
      }}
      value={filterText}
      placeholder={label}
      color="secondary"
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      endAdornment={
        filterText !== '' && (
          <InputAdornment position="end">
            <IconButton onClick={() => setFilterText('')} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }
    />
  );
};

export default FilterInput;
