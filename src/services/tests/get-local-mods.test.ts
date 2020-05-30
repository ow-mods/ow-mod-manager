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
  disabled: 'disabled',
  defaultConfig: 'default-config',
  brokenDefaultConfig: 'broken-default-config',
};

beforeEach(() => {
  mockFs({
    [paths.correctManifest]: JSON.stringify(correctManifest),
    [paths.brokenManifest]: JSON.stringify(brokenManifest),
    [paths.brokenConfig]: {
      'manifest.json': JSON.stringify(correctManifest),
      'config.json': '{',
    },
    [paths.disabled]: {
      'manifest.json': JSON.stringify(correctManifest),
      'config.json': JSON.stringify({ enabled: false }),
    },
    [paths.defaultConfig]: {
      'manifest.json': JSON.stringify(correctManifest),
      'default-config.json': JSON.stringify({ enabled: false }),
    },
    [paths.brokenDefaultConfig]: {
      'manifest.json': JSON.stringify(correctManifest),
      'default-config.json': '{',
    },
  });
});

afterEach(() => {
  mockFs.restore();
});

test('Get local mod with correct manifest', async () => {
  const mod = await getLocalMod(paths.correctManifest);

  expect(mod.errors).toHaveLength(0);
  expect(mod.isEnabled).toEqual(true);
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

test('Get local mod with config disabled', async () => {
  const mod = await getLocalMod(`${paths.disabled}/manifest.json`);

  expect(mod.errors).toHaveLength(0);
  expect(mod.isEnabled).toEqual(true);
});

test('Get local mod with default config disabled', async () => {
  const mod = await getLocalMod(`${paths.defaultConfig}/manifest.json`);

  expect(mod.errors).toHaveLength(0);
  expect(mod.isEnabled).toEqual(true);
});

test('Get local mod with broken default config', async () => {
  const mod = await getLocalMod(`${paths.brokenDefaultConfig}/manifest.json`);

  expect(mod.errors).toHaveLength(1);
  expect(mod.errors).toEqual(
    expect.arrayContaining([expect.stringContaining('default-config.json')]),
  );
});
