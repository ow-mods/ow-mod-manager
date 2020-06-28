import React from 'react';

import SwitchInput from './SwitchInput';
import SliderInput from './SliderInput';
import TextInput from './TextInput';

type Props = {
  value?: boolean | string | number;
  onChange: (value: boolean | string | number) => void;
  label: string;
  disabled?: boolean;
  tooltip?: string;
};

const SettingFormControl: React.FunctionComponent<Props> = ({
  value,
  ...props
}) => {
  if (typeof value === 'boolean') {
    return <SwitchInput value={value} {...props} />;
  }

  if (typeof value === 'string') {
    return <TextInput value={value} {...props} />;
  }

  if (typeof value === 'number') {
    return <SliderInput value={value} {...props} />;
  }

  return null;
};

export default SettingFormControl;
