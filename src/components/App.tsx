import { hot } from 'react-hot-loader/root';
import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { green, orange } from '@material-ui/core/colors';

import { LogsProvider, AppStateProvider } from '../hooks';
import MainView from './MainView';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: green[700],
    },
    secondary: {
      main: orange[800],
    },
  },
});

const App = () => (
  <AppStateProvider>
    <LogsProvider>
      <ThemeProvider theme={theme}>
        <MainView />
      </ThemeProvider>
    </LogsProvider>
  </AppStateProvider>
);

export default hot(App);
