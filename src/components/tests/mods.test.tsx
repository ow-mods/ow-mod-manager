import React from 'react';
import mockFs from 'mock-fs';
import { render, waitFor, within } from '@testing-library/react';

import { useAppState, AppStateProvider } from '../../hooks';
import ModsPage from '../Mods';

import config from '../../config.json';
import { before } from 'lodash';

const localModManifest: Manifest = {
  author: 'TEST_LOCAL_MOD_AUTHOR',
  name: 'TEST_LOCAL_MOD_NAME',
  uniqueName: 'TEST_LOCAL_MOD_UNIQUE_NAME',
  version: 'TEST_LOCAL_MOD_VERSION',
};

const ContextHelper: React.FunctionComponent<{ spy: jest.Mock }> = ({
  spy,
}) => {
  const contextData = useAppState();
  spy(contextData);
  return null;
};

describe('Mods page', () => {
  it('is able to uninstall mod', async () => {
    mockFs({
      [config.owmlPath]: {
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

    mockFs.restore();
  });
});

describe('Mods page', () => {
  it('is able to install mod', async () => {
    const contextCallback = jest.fn();
    const { findByText, findByTestId } = render(
      <AppStateProvider>
        <ModsPage />
        <ContextHelper spy={contextCallback} />
      </AppStateProvider>,
    );

    const modName = await findByTestId(`mod-row-Raicuparta.AutoResume`);
    const row = modName.closest('tr') as HTMLElement;
    expect(row).not.toBeNull();

    const { findByTestId: rowFindId } = within(row);
    const install = (await rowFindId('mod-action-install')) as HTMLElement;
    expect(install).toBeEnabled();

    install.click();

    await waitFor(() => {
      expect(install).toBeEnabled();
    });
  });
});
