import { useState, useEffect } from 'react';
import { merge } from 'lodash';

import modDB from '../mod-db.json';
import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import { addLocalModsCallback, removeLocalModsCallback } from '../services/mod-manager';

function useModMap() {
  const [modList, setModList] = useState<ModMap>({});
  const [remoteModList, setRemoteModList] = useState<ModMap>({});
  const [localModList, setLocalModList] = useState<ModMap>({});
  const [isLocalDirty, setIsLocalDirty] = useState<boolean>(true);

  useEffect(() => {
    const callback = () => {
      setIsLocalDirty(true);
    };

    addLocalModsCallback(callback);

    return () => {
      removeLocalModsCallback(callback);
    };
  }, []);

  useEffect(() => {
    if (!isLocalDirty) {
      return;
    }

    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModList(localMods);
    };
    getMods();

    setIsLocalDirty(false);
  }, [isLocalDirty]);

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
    setModList(merge({}, remoteModList, localModList));
  }, [remoteModList, localModList]);

  return modList;
}

export default useModMap;
