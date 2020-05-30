import 'regenerator-runtime/runtime';
import { getLocalMod } from '../get-local-mods';
import fs from 'fs-extra';

function mockReadJson(response: Record<string, unknown>) {
  jest
    .spyOn(fs, 'readJson')
    .mockImplementation(() => new Promise((resolve) => resolve(response)));
}

test('Get local mod with correct manifest', async () => {
  const manifest: Partial<Manifest> = {
    author: 'author',
    name: 'name',
    uniqueName: 'uniqueName',
    version: 'version',
  };

  mockReadJson(manifest);
  const mod = await getLocalMod('');

  expect(mod.errors).toHaveLength(0);
});

test('Get local mod with broken manifest', async () => {
  const manifest: Partial<Manifest> = {
    author: 'author',
    name: 'name',
    version: 'version',
  };

  mockReadJson(manifest);
  const mod = await getLocalMod('');

  expect(mod.errors).toHaveLength(1);
  expect(
    mod.errors.find((error) => error.includes('uniqueName')),
  ).toBeDefined();
});
