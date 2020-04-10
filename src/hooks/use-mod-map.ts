import { useState, useEffect, useContext } from 'react';
import { merge } from 'lodash';

import modDB from '../mod-db.json';
import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';
import { Context } from '../components/App';

function useModMap() {
  const [modList, setModList] = useState<ModMap>({});
  const [remoteModList, setRemoteModList] = useState<ModMap>({});
  const [localModList, setLocalModList] = useState<ModMap>({});
  const { setIsLocalModsDirty, isLocalModsDirty } = useContext(Context);

  useEffect(() => {
    if (!isLocalModsDirty) {
      return;
    }
    const getMods = async () => {
      const localMods = await getLocalMods();
      setLocalModList(localMods);
      setIsLocalModsDirty(false);
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
    setModList(merge({}, remoteModList, localModList));
  }, [remoteModList, localModList]);

  return modList;
}

export default useModMap;
