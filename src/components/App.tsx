import { hot } from 'react-hot-loader/root';
import {
  createMuiTheme,
  // The typings for this package haven't been updated yet,
  // So we need to ignore typescript and eslint rules to
  // import experimental stuff.
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  ThemeProvider,
  unstable_createMuiStrictModeTheme as unstableCreateMuiStrictModeTheme,
} from '@material-ui/core/styles';
import { green, orange } from '@material-ui/core/colors';

import React from 'react';
import { AppStateProvider, LogsProvider, SettingsProvider } from '../hooks';
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
  <SettingsProvider>
    <AppStateProvider>
      <LogsProvider>
        <ThemeProvider theme={theme}>
          <MainView />
        </ThemeProvider>
      </LogsProvider>
    </AppStateProvider>
  </SettingsProvider>
);

export default hot(App);
