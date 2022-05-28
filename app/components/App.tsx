import {
  createMuiTheme,
  ThemeProvider,
  // The typings for this package haven't been updated yet,
  // So we need to ignore typescript and eslint rules to
  // import experimental stuff.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  unstable_createMuiStrictModeTheme as unstableCreateMuiStrictModeTheme,
} from '@material-ui/core/styles';
import { green, grey, red } from '@material-ui/core/colors';
import { RecoilRoot } from 'recoil';

import React from 'react';
import MainView from './MainView';
import {
  SettingsSubscription,
  LocalModsSubscription,
  LogsSubscription,
  RemoteModsSubscription,
} from '../subscriptions';
import { ErrorBoundary } from './ErrorBoundary';

// Compatibility with React concurrent mode.
const createMuiStrictTheme = unstableCreateMuiStrictModeTheme as typeof createMuiTheme;

const theme = createMuiStrictTheme({
  palette: {
    type: 'dark',
    primary: {
      main: green[700],
    },
    secondary: {
      main: '#ca7300',
      dark: '#975d2e',
      light: '#ffc380',
    },
    error: {
      main: red[500],
      dark: '#7e1e1e',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          overflowY: 'hidden',
        },
        '*::-webkit-scrollbar': {
          width: '1em',
          cursor: 'pointer',
        },
        '*::-webkit-scrollbar-track': {
          background: grey[800],
          borderRadius: 0,
        },
        '*::-webkit-scrollbar-thumb': {
          background: grey[700],
          border: `2px solid ${grey[800]}`,
          borderRadius: 0,
          '&:hover': {
            background: grey[600],
          },
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: '1em',
      },
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <SettingsSubscription />
        </ErrorBoundary>
        <ErrorBoundary>
          <LocalModsSubscription />
        </ErrorBoundary>
        <ErrorBoundary>
          <RemoteModsSubscription />
        </ErrorBoundary>
        <ErrorBoundary>
          <LogsSubscription />
        </ErrorBoundary>
        <ErrorBoundary>
          <MainView />
        </ErrorBoundary>
      </ThemeProvider>
    </RecoilRoot>
  </ErrorBoundary>
);

export default App;
