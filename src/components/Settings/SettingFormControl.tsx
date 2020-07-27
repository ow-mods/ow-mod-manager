import React from 'react';

import SwitchInput from './SwitchInput';
import SliderInput from './SliderInput';
import TextInput from './TextInput';
import PathInput from './PathInput';

export enum SettingType {
  Text,
  Switch,
  Path,
  Slider,
}

type Props = {
  value?: boolean | string | number;
  onChange: (value: boolean | string | number) => void;
  label: string;
  type: SettingType;
  disabled?: boolean;
  tooltip?: string;
};

const SettingFormControl: React.FunctionComponent<Props> = ({
  value,
  type,
  ...props
}) => {
  if (type === SettingType.Switch && typeof value === 'boolean') {
    return <SwitchInput value={value} {...props} />;
  }

  if (type === SettingType.Text && typeof value === 'string') {
    return <TextInput value={value} {...props} />;
  }

  if (type === SettingType.Path && typeof value === 'string') {
    return <PathInput value={value} {...props} />;
  }

  if (type === SettingType.Slider && typeof value === 'number') {
    return <SliderInput value={value} {...props} />;
  }

  return null;
};

export default SettingFormControl;
