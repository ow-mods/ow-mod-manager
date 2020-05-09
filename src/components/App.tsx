import { hot } from 'react-hot-loader/root';
import React from 'react';
import {
  createMuiTheme,
  // The typings for this package haven't been updated yet,
  // So we need to ignore typescript and eslint rules to
  // import experimental stuff.
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  unstable_createMuiStrictModeTheme as unstableCreateMuiStrictModeTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { green, orange } from '@material-ui/core/colors';

import { LogsProvider, AppStateProvider } from '../hooks';
import MainView from './MainView';

// Compatibility with React current mode.
const createMuiStrictTheme = unstableCreateMuiStrictModeTheme as typeof createMuiTheme;
const theme = createMuiStrictTheme({
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
