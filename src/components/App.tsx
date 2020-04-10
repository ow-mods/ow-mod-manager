import { hot } from 'react-hot-loader/root';
import React from 'react';

import { AppStateProvider } from './AppState';
import ModList from './ModList';

const App = () => (
  <AppStateProvider>
    <ModList />
  </AppStateProvider>
);

export default hot(App);
