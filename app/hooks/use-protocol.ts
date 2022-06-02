import { ipcRenderer, remote } from 'electron';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { debugConsole } from '../helpers/console-log';
import { install } from '../services';
import { modIsLoadingState, modList, modProgressState } from '../store';

export function useProtocol(): void {
  const mods = useRecoilValue(modList);
  const [protocolModUniqueName, setProtocolModUniqueName] = useState<
    string | undefined
  >(undefined);
  const setModProgress = useSetRecoilState(
    modProgressState(protocolModUniqueName)
  );
  const setIsLoading = useSetRecoilState(
    modIsLoadingState(protocolModUniqueName)
  );

  useEffect(() => {
    if (!protocolModUniqueName) return;

    // TODO try not to duplicate code between here and ModActions.
    setIsLoading(true);

    debugConsole.log('Installing mod from protocol', protocolModUniqueName);

    const mod = mods.find(
      ({ uniqueName }) => uniqueName === protocolModUniqueName
    );

    if (!mod) {
      return;
    }

    install(mod, setModProgress)
      .finally(() => {
        // TODO try something better than a timeout here.
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        debugConsole.error('Error installing mod from protocol', error);
      });

    setProtocolModUniqueName(undefined);
  }, [protocolModUniqueName, setIsLoading, setModProgress, mods]);

  const handleProtocol = useCallback(
    (_event: Electron.IpcRendererEvent, uniqueName: string) => {
      debugConsole.log('received protocol mod message', uniqueName);
      setProtocolModUniqueName(uniqueName);
    },
    []
  );

  useEffect(() => {
    // TODO try to avoid magic strings.
    ipcRenderer.on('mod-protocol', handleProtocol);
    return () => {
      ipcRenderer.off('mod-protocol', handleProtocol);
    };
  }, [handleProtocol]);

  useEffect(() => {
    debugConsole.log('Sending protocol ready signal');
    ipcRenderer.send('mod-protocol-ready', true);
  }, []);
}
