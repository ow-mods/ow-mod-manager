import React, { FunctionComponent, useCallback } from 'react';
import {
  ListItem,
  Typography,
  Slider,
  makeStyles,
  Tooltip,
} from '@material-ui/core';

type Props = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

const useStyles = makeStyles(({ spacing }) => ({
  slider: {
    margin: `0 ${spacing(2)}px ${spacing(2)}px ${spacing(4)}px`,
    width: `calc(100% - ${2 * spacing(2)}px)`,
    flex: 1,
  },
}));

const SliderInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
  tooltip = '',
}) => {
  const styles = useStyles();
  const handleChange = useCallback(
    (_: React.ChangeEvent<unknown>, changeValue: number | number[]) =>
      onChange(typeof changeValue === 'number' ? changeValue : changeValue[0]),
    [onChange],
  );

  return (
    <Tooltip title={tooltip} placement="bottom">
      <ListItem>
        <Typography>{label}</Typography>
        <Slider
          disabled={disabled}
          className={styles.slider}
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
      </ListItem>
    </Tooltip>
  );
};

export default SliderInput;
