import React, { FunctionComponent, useCallback } from 'react';
import { ListItem, Typography, Slider, ListItemText } from '@material-ui/core';

type Props = {
  value: number;
  onChange: (value: number) => void;
  label: string;
};

const SliderInput: FunctionComponent<Props> = ({ value, onChange, label }) => {
  const handleChange = useCallback(
    (_: React.ChangeEvent<{}>, changeValue: number | number[]) =>
      onChange(typeof changeValue === 'number' ? changeValue : changeValue[0]),
    [],
  );

  return (
    <ListItem>
      <ListItemText>
        <Typography>{label}</Typography>
        <Slider
          value={value}
          onChange={handleChange}
          step={10}
          min={10}
          max={200}
          valueLabelDisplay="auto"
          color="secondary"
          marks={[
            { value: 10, label: '10' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 150, label: '150' },
            { value: 200, label: '200' },
          ]}
        />
      </ListItemText>
    </ListItem>
  );
};

export default SliderInput;
