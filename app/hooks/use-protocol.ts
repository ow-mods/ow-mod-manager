import { ipcRenderer, remote } from 'electron';
import { useCallback, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { install } from '../services';
import { modList } from '../store';

export function useProtocol(): void {
  const mods = useRecoilValue(modList);

  const handleProtocol = useCallback(
    (_event: Electron.IpcRendererEvent, protocolModUniqueName: string) => {
      const mod = mods.find(
        ({ uniqueName }) => uniqueName === protocolModUniqueName
      );
      if (!mod) {
        remote.dialog.showErrorBox('TODO Mod not found', 'TODO translate');
        return;
      }
      install(mod, () => {});
    },
    [mods]
  );

  useEffect(() => {
    ipcRenderer.on('mod-protocol', handleProtocol);
    return () => {
      ipcRenderer.off('mod-protocol', handleProtocol);
    };
  }, [handleProtocol]);
}
