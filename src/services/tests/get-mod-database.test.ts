import 'regenerator-runtime/runtime';
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { getModDatabase, RemoteModDatabase, ModDatabase } from '..';

jest.mock('node-fetch', () => jest.fn());

describe('Get mod database', () => {
  it('retrieves correctly shaped mod database', async () => {
    const modManifest: Manifest = {
      author: 'author',
      name: 'name',
      uniqueName: 'uniqueName',
      version: 'version',
    };

    const remoteModDatabase: RemoteModDatabase = {
      modManager: {
        downloadUrl: 'MOD_MANAGER_URL',
        version: 'MOD_MANAGER_VERSION',
      },
      releases: [
        {
          downloadUrl: '',
          downloadCount: 0,
          manifest: modManifest,
          repo: '',
        },
      ],
    };

    const expectedResponse: ModDatabase = {
      modManager: {
        downloadUrl: 'MOD_MANAGER_URL',
        version: 'MOD_MANAGER_VERSION',
      },
      mods: [
        {
          name: modManifest.name,
          author: modManifest.author,
          uniqueName: modManifest.uniqueName,
          remoteVersion: modManifest.version,
          modPath: `OWML/Mods/${modManifest.uniqueName}`,
          downloadUrl: '',
          downloadCount: 0,
          repo: '',
          errors: [],
        },
      ],
    };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(remoteModDatabase)),
    );

    const response = await getModDatabase('https://test.test');

    expect(response).toMatchObject(expectedResponse);
  });

  it('adds errors to mods with missing manifest attributes', async () => {
    const modManifest = {
      author: 'author',
      name: 'name',
      uniqueName: 'uniqueName',
    } as const;

    const remoteModDatabase: RemoteModDatabase = {
      modManager: {
        downloadUrl: 'MOD_MANAGER_URL',
        version: 'MOD_MANAGER_VERSION',
      },
      releases: [
        {
          downloadUrl: '',
          downloadCount: 0,
          manifest: modManifest,
          repo: '',
        },
      ],
    };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(remoteModDatabase)),
    );

    const response = await getModDatabase('https://test.test');

    expect(response.mods[0].errors).toEqual(
      expect.arrayContaining([expect.stringContaining('version')]),
    );
  });
});
