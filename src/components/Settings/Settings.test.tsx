import React from 'react';

import { render, fireEvent, screen } from '@testing-library/react';
import SwitchInput from './SwitchInput';

test('calls "onChange" prop on switch click', () => {
  const label = '__TEST SWITCH LABEL__';
  const onChange = jest.fn();

  render(<SwitchInput value={false} onChange={onChange} label={label} />);

  fireEvent.click(screen.getByText(label));

  expect(onChange).toHaveBeenCalled();
});
