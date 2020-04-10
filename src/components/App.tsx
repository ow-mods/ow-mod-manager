import { hot } from 'react-hot-loader/root';
import React from 'react';

import Container from '@material-ui/core/Container';

import { AppStateProvider } from './AppState';
import ModList from './ModList';

const App = () => (
  <AppStateProvider>
    <Container>
      <ModList />
    </Container>
  </AppStateProvider>
);

export default hot(App);
