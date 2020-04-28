import React from 'react';
import { Grow, Tooltip as TooltipBase } from '@material-ui/core';

// Tooltip transitions don't play well with concurrent mode,
// so we're creating a transition type that does nothing.
const NoTransition: typeof Grow = ({ children }) => <>{children}</>;

const Tooltip: typeof TooltipBase = (props) => (
  <TooltipBase {...props} TransitionComponent={NoTransition} />
);

export default Tooltip;
