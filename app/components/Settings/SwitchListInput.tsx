import React, { FunctionComponent } from 'react';

import SwitchInput from './SwitchInput';

type Props = {
  value: Record<string, boolean>;
  onChange: (value: Record<string, boolean>) => void;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

const SwitchListInput: FunctionComponent<Props> = ({
  value,
  onChange,
  label,
  disabled,
  tooltip = '',
}) => (
  <>
    {Object.entries(value).map(([itemKey, itemValue]) => (
      <SwitchInput
        key={itemKey}
        disabled={disabled}
        tooltip={tooltip}
        value={itemValue}
        label={`${label} ${itemKey}`}
        onChange={(switchValue) =>
          onChange({
            ...value,
            [itemKey]: switchValue,
          })
        }
      />
    ))}
  </>
);

export default SwitchListInput;
