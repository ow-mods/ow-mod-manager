import React from 'react';
import { render, waitFor, within } from '@testing-library/react';
import fs from 'fs-extra';

import { useAppState, AppStateProvider } from '../../hooks';
import ModsPage from '../Mods';

const ContextHelper: React.FunctionComponent<{ spy: jest.Mock }> = ({
  spy,
}) => {
  const contextData = useAppState();
  spy(contextData);
  return null;
};

const modUniqueName = 'Raicuparta.AutoResume';

describe('Mods page', () => {
  it('is able to install and uninstall mod', async () => {
    const modsPath = `OWML/Mods/${modUniqueName}`;
    if (fs.existsSync(modsPath)) {
      fs.removeSync(modsPath);
    }

    const contextCallback = jest.fn();
    const { findByTestId } = render(
      <AppStateProvider>
        <ModsPage />
        <ContextHelper spy={contextCallback} />
      </AppStateProvider>,
    );

    const modName = await findByTestId(`mod-row-${modUniqueName}`);
    const row = modName.closest('tr') as HTMLElement;
    expect(row).not.toBeNull();

    const { findByTestId: rowFindId } = within(row);
    const install = (await rowFindId('mod-action-install')) as HTMLElement;
    expect(install).toBeEnabled();

    install.click();

    await waitFor(() => {
      expect(install).toBeDisabled();
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const more = (await rowFindId('mod-action-more')) as HTMLElement;
    more.click();

    const uninstall = (await findByTestId(
      `mod-action-uninstall-${modUniqueName}`,
    )) as HTMLElement;
    uninstall.click();

    await waitFor(() => {
      expect(install).toBeEnabled();
    });
  });
});
