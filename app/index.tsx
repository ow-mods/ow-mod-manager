import React from 'react';
import { unstable_createRoot } from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const App = require('./components/App').default;
  unstable_createRoot(document.getElementById('root') as HTMLElement).render(
    <App />
  );
});
