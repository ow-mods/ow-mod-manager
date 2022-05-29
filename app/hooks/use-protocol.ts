import { ipcRenderer, remote } from 'electron';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { debugConsole } from '../helpers/console-log';
import { install } from '../services';
import { modIsLoadingState, modList, modProgressState } from '../store';

export function useProtocol(): void {
  const mods = useRecoilValue(modList);
  const [protocolMod, setProtocolMod] = useState<Mod | undefined>(undefined);
  const setModProgress = useSetRecoilState(
    modProgressState(protocolMod?.uniqueName)
  );
  const setIsLoading = useSetRecoilState(
    modIsLoadingState(protocolMod?.uniqueName)
  );

  useEffect(() => {
    if (protocolMod) {
      setIsLoading(true);
      install(protocolMod, setModProgress)
        .finally(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          debugConsole.error('Error installing mod from protocol', error);
        });
    }
  }, [protocolMod, setIsLoading, setModProgress]);

  const handleProtocol = useCallback(
    (_event: Electron.IpcRendererEvent, protocolModUniqueName: string) => {
      const mod = mods.find(
        ({ uniqueName }) => uniqueName === protocolModUniqueName
      );
      if (!mod) {
        remote.dialog.showErrorBox('TODO Mod not found', 'TODO translate');
        return;
      }
      setProtocolMod(mod);
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
