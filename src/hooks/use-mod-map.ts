import { useState, useEffect, useContext } from 'react';
import { merge } from 'lodash';

import modDB from '../mod-db.json';
import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import AppState from '../components/AppState';

function useModMap() {
  const [remoteModList, setRemoteModList] = useState<ModMap>({});
  const [localModList, setLocalModList] = useState<ModMap>({});
  const appState = useContext(AppState);
  const { isLocalModsDirty, setAppState } = appState;

  useEffect(() => {
    if (!isLocalModsDirty) {
      return;
    }
    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModList(localMods);
      setAppState({ isLocalModsDirty: false });
    };
    getMods();
  }, [isLocalModsDirty]);

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      const remoteMod = await getRemoteMod(modDbItem);
      setRemoteModList((remoteMods) => ({
        ...remoteMods,
        [remoteMod.uniqueName]: remoteMod,
      }));
    };
    modDB.map(getMod);
  }, []);

  useEffect(() => {
    const modMap = merge({}, remoteModList, localModList);
    setAppState({
      isLocalModsDirty,
      modMap,
    });
  }, [remoteModList, localModList]);
}

export default useModMap;
