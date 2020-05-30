import 'regenerator-runtime/runtime';
import { getLocalMod } from '../get-local-mods';
import fs from 'fs-extra';

test('get local mods', async () => {
  const manifestPath = '__TEST MANIFEST PATH__';
  const manifest: Partial<Manifest> = {
    author: 'author',
    name: 'name',
    uniqueName: 'uniqueName',
    version: 'version',
  };

  jest
    .spyOn(fs, 'readJson')
    .mockImplementation(() => new Promise((resolve) => resolve(manifest)));

  const mod = await getLocalMod(manifestPath);

  expect(mod.errors).toHaveLength(0);
});

test('get local mods', async () => {
  const manifestPath = '__TEST MANIFEST PATH__';
  const manifest: Partial<Manifest> = {
    author: 'author',
    name: 'name',
    version: 'version',
  };

  jest
    .spyOn(fs, 'readJson')
    .mockImplementation(() => new Promise((resolve) => resolve(manifest)));

  const mod = await getLocalMod(manifestPath);

  expect(mod.errors).toHaveLength(1);
  expect(
    mod.errors.find((error) => error.includes('uniqueName')),
  ).toBeDefined();
});
