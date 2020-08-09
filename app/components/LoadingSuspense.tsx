import React from 'react';

const LoadingSuspense: React.FunctionComponent = ({ children }) => (
  <React.Suspense fallback={<div>Loading...</div>}>{children}</React.Suspense>
);

export default LoadingSuspense;
