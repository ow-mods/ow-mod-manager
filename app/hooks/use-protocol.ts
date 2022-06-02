import { ipcRenderer } from 'electron';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useSettings } from './use-settings';
import { debugConsole } from '../helpers/console-log';
import { install } from '../services';
import {
  modIsLoadingState,
  modList,
  modProgressState,
  selectedTabState,
} from '../store';

const alphaProtocolSuffix = 'alpha::';

export function useProtocol(): void {
  const mods = useRecoilValue(modList);
  const [protocolText, setProtocolText] = useState<string | undefined>(
    undefined
  );
  const setModProgress = useSetRecoilState(modProgressState(protocolText));
  const setIsLoading = useSetRecoilState(modIsLoadingState(protocolText));
  const setSelectedTab = useSetRecoilState(selectedTabState);
  const { setSettings, settings } = useSettings();

  useEffect(() => {
    if (!protocolText) return;

    // TODO try not to duplicate code between here and ModActions.
    setIsLoading(true);
    setSelectedTab(0);

    const isAlphaMod = protocolText.startsWith(alphaProtocolSuffix);

    if (settings.alphaMode !== isAlphaMod) {
      setSettings({
        alphaMode: isAlphaMod,
      });
      return;
    }

    const protocolUniqueName = isAlphaMod
      ? protocolText.slice(alphaProtocolSuffix.length)
      : protocolText;

    debugConsole.log('Installing mod from protocol', protocolUniqueName);

    const mod = mods.find(
      ({ uniqueName }) => uniqueName === protocolUniqueName
    );

    if (!mod) {
      debugConsole.warn(
        'Failed to find protocol mod in list',
        protocolUniqueName
      );
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

    setProtocolText(undefined);
  }, [
    protocolText,
    setIsLoading,
    setModProgress,
    mods,
    setSettings,
    settings.alphaMode,
    setSelectedTab,
  ]);

  const handleProtocol = useCallback(
    (_event: Electron.IpcRendererEvent, protocolEventText: string) => {
      debugConsole.log('received protocol mod message', protocolEventText);
      setProtocolText(protocolEventText);
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
