import 'regenerator-runtime/runtime';
import mockFs from 'mock-fs';

import { getLocalMod } from '..';

const correctManifest: Manifest = {
  author: 'author',
  name: 'name',
  uniqueName: 'uniqueName',
  version: 'version',
};

const brokenManifest: Partial<Manifest> = {
  author: 'author',
  name: 'name',
  uniqueName: 'uniqueName',
};

const paths = {
  correctManifest: 'correct-manifest',
  brokenManifest: ' broken-manifest',
  brokenConfig: 'broken-config',
};

beforeEach(() => {
  mockFs({
    [paths.correctManifest]: JSON.stringify(correctManifest),
    [paths.brokenManifest]: JSON.stringify(brokenManifest),
    [paths.brokenConfig]: {
      'manifest.json': JSON.stringify(correctManifest),
      'config.json': '{',
    },
  });
});

afterEach(() => {
  mockFs.restore();
});

test('Get local mod with correct manifest', async () => {
  const mod = await getLocalMod(paths.correctManifest);

  expect(mod.errors).toHaveLength(0);
});

test('Get local mod with broken manifest', async () => {
  const mod = await getLocalMod(paths.brokenManifest);

  expect(mod.errors).toHaveLength(1);
  expect(
    mod.errors.find(
      (error) => typeof error === 'string' && error.includes('version'),
    ),
  ).toBeDefined();
});

test('Get local mod with broken config', async () => {
  const mod = await getLocalMod(`${paths.brokenConfig}/manifest.json`);

  expect(mod.errors).toHaveLength(1);
  expect(mod.errors).toEqual(
    expect.arrayContaining([expect.stringContaining('config.json')]),
  );
});
