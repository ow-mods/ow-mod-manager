import { hot } from 'react-hot-loader/root';
import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { AppStateProvider } from './AppState';
import ModList from './ModList';
import { Test } from './Test';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App = () => (
  <AppStateProvider>
    <ThemeProvider theme={theme}>
      <Container>
        <Test />
        <ModList />
      </Container>
    </ThemeProvider>
  </AppStateProvider>
);

export default hot(App);
