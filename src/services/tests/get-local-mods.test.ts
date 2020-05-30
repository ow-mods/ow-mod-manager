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

beforeEach(() => {
  mockFs({
    'correct-manifest': {
      'manifest.json': JSON.stringify(correctManifest),
    },
    'broken-manifest': {
      'manifest.json': JSON.stringify(brokenManifest),
    },
    'broken-config': {
      'manifest.json': JSON.stringify(correctManifest),
      'config.json': '{',
    },
  });
});

afterEach(() => {
  mockFs.restore();
});

test('Get local mod with correct manifest', async () => {
  const mod = await getLocalMod('correct-manifest/manifest.json');

  expect(mod.errors).toHaveLength(0);
});

test('Get local mod with broken manifest', async () => {
  const mod = await getLocalMod('broken-manifest/manifest.json');

  expect(mod.errors).toHaveLength(1);
  expect(
    mod.errors.find(
      (error) => typeof error === 'string' && error.includes('version'),
    ),
  ).toBeDefined();
});

test('Get local mod with broken config', async () => {
  const mod = await getLocalMod('broken-config/manifest.json');

  expect(mod.errors).toHaveLength(1);
  expect(mod.errors).toEqual(
    expect.arrayContaining([expect.stringContaining('config.json')]),
  );
});
