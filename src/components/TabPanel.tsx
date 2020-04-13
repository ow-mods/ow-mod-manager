import React from 'react';

interface Props {
  index: number;
  value: number;
}

const TabPanel: React.FunctionComponent<Props> = ({
  value,
  index,
  children,
}) => {
  return value === index && <div>{children}</div>;
};

export default TabPanel;
