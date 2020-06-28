import React from 'react';

import SwitchInput from './SwitchInput';
import SliderInput from './SliderInput';
import TextInput from './TextInput';

const SettingFormControl: React.FunctionComponent<{
  value?: boolean | string | number;
  onChange: (value: boolean | string | number) => void;
  label: string;
  disabled?: boolean;
}> = ({ value, ...props }) => {
  if (typeof value === 'boolean') {
    return <SwitchInput value={value} {...props} />;
  }

  if (typeof value === 'string') {
    return <TextInput value={value} {...props} />;
  }

  if (typeof value === 'boolean') {
    return <SliderInput value={value} {...props} />;
  }

  return null;
};

export default SettingFormControl;
