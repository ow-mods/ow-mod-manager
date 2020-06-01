import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import { getModDatabase, RemoteModDatabase, ModDatabase } from '..';

jest.mock('node-fetch', () => jest.fn());

const correctModManifest: Manifest = {
  author: 'author',
  name: 'name',
  uniqueName: 'uniqueName',
  version: 'version',
};

const correctRemoteModDatabase: RemoteModDatabase = {
  modManager: {
    downloadUrl: 'MOD_MANAGER_URL',
    version: 'MOD_MANAGER_VERSION',
  },
  releases: [
    {
      downloadUrl: '',
      downloadCount: 0,
      manifest: correctModManifest,
      repo: '',
    },
  ],
};

describe('Get mod database', () => {
  it('retrieves correctly shaped mod database', async () => {
    const expectedResponse: ModDatabase = {
      modManager: {
        downloadUrl: 'MOD_MANAGER_URL',
        version: 'MOD_MANAGER_VERSION',
      },
      mods: [
        {
          name: correctModManifest.name,
          author: correctModManifest.author,
          uniqueName: correctModManifest.uniqueName,
          remoteVersion: correctModManifest.version,
          modPath: `OWML/Mods/${correctModManifest.uniqueName}`,
          downloadUrl: '',
          downloadCount: 0,
          repo: '',
          errors: [],
        },
      ],
    };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(correctRemoteModDatabase)),
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

  it('throws error if fetch throws', async () => {
    const error = new Error('test connection error');

    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(error);

    try {
      await getModDatabase('https://test.test');
      expect(false).toEqual(true);
    } catch (error) {
      expect(true).toEqual(true);
    }
  });

  it('throws error if response not ok', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify(correctRemoteModDatabase), { status: 404 }),
    );

    try {
      await getModDatabase('https://test.test');
      fail("getModDatabase didn't throw error on 404");
    } catch (error) {
      expect(error.message || error).toContain('404');
    }
  });
});
