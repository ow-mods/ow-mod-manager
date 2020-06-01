import React from 'react';
import mockFs from 'mock-fs';
import fetch from 'node-fetch';
import { render, waitFor, within } from '@testing-library/react';

import { RemoteModDatabase } from '../../services';
import { useAppState, AppStateProvider } from '../../hooks';
import ModsPage from '../Mods';

const { Response } = jest.requireActual('node-fetch');

jest.mock('node-fetch', () => jest.fn());

let mockedConfig: typeof config;

jest.mock(
  '../../config.json',
  () => {
    mockedConfig = {
      settingsPath: 'TEST_SETTINGS_FILE.json',
      owmlPath: 'TEST_OWML_PATH',
      defaultSettings: {
        closeOnPlay: false,
        logToSocket: true,
        logLinesLimit: 50,
        showAdvancedSettings: false,
        modDatabaseUrl: 'TEST_DATABASE_URL',
      },
    };
    return mockedConfig;
  },
  {
    virtual: true,
  },
);
import config from '../../config.json';

const localModManifest: Manifest = {
  author: 'TEST_LOCAL_MOD_AUTHOR',
  name: 'TEST_LOCAL_MOD_NAME',
  uniqueName: 'TEST_LOCAL_MOD_UNIQUE_NAME',
  version: 'TEST_LOCAL_MOD_VERSION',
};

const remoteModManifest: Manifest = {
  author: 'TEST_REMOTE_MOD_AUTHOR',
  name: 'TEST_REMOTE_MOD_NAME',
  uniqueName: 'TEST_REMOTE_MOD_UNIQUE_NAME',
  version: 'TEST_REMOTE_MOD_VERSION',
};

const correctRemoteModDatabase: RemoteModDatabase = {
  modManager: {
    downloadUrl: 'MOD_MANAGER_URL',
    version: 'MOD_MANAGER_VERSION',
  },
  releases: [
    {
      downloadUrl: 'TEST_MOD_DOWNLOAD_URL',
      downloadCount: 0,
      manifest: remoteModManifest,
      repo: 'TEST_MOD_REPO',
    },
  ],
};

beforeEach(() => {
  mockFs({
    [mockedConfig.owmlPath]: {
      'OWML.Manifest.json': JSON.stringify({
        name: 'OWML',
        author: 'Alek',
        uniqueName: 'Alek.OWML',
        version: 'TEST_OWML_VERSION',
      }),
      Mods: {
        testMod: {
          'manifest.json': JSON.stringify(localModManifest),
          'config.json': JSON.stringify({ enabled: false }),
        },
      },
    },
  });
});

afterEach(() => {
  mockFs.restore();
});

const ContextHelper: React.FunctionComponent<{ spy: jest.Mock }> = ({
  spy,
}) => {
  const contextData = useAppState();
  spy(contextData);
  return null;
};

describe('Mods page', () => {
  it('is able to uninstall mod', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(correctRemoteModDatabase)),
    );

    const contextCallback = jest.fn();
    const { findByText, findByTestId } = render(
      <AppStateProvider>
        <ModsPage />
        <ContextHelper spy={contextCallback} />
      </AppStateProvider>,
    );

    const modAuthor = await findByText(localModManifest.author);
    const row = modAuthor.closest('tr') as HTMLElement;
    expect(row).not.toBeNull();

    const { findByTestId: rowFindId } = within(row);
    const install = await rowFindId('mod-action-install');
    expect(install).toBeDisabled();

    const more = (await rowFindId('mod-action-more')) as HTMLElement;
    more.click();

    const uninstall = (await findByTestId(
      `mod-action-uninstall-${localModManifest.uniqueName}`,
    )) as HTMLElement;
    uninstall.click();

    await waitFor(() => {
      expect(install).toBeDisabled();
    });
  });
});
