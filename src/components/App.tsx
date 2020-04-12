import { hot } from 'react-hot-loader/root';
import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { AppStateProvider } from './AppState';
import ModList from './ModList';
import TopBar from './TopBar';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App = () => (
  <AppStateProvider>
    <ThemeProvider theme={theme}>
      <Container>
        <TopBar />
        <ModList />
      </Container>
    </ThemeProvider>
  </AppStateProvider>
);

export default hot(App);
