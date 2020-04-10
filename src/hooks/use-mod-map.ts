import { useState, useEffect } from 'react';
import { merge } from 'lodash';

import modDB from '../mod-db.json';
import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';

function useModMap() {
  const [modList, setModList] = useState<ModMap>({});

  useEffect(() => {
    const getMods = async () => {
      const localMods = await getLocalMods();
      setModList((mods) => merge({}, mods, localMods));
    };
    getMods();
  }, []);

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      const remoteMod = await getRemoteMod(modDbItem);
      setModList((mods) => merge({}, mods, {
        [remoteMod.uniqueName]: merge({}, remoteMod, mods[remoteMod.uniqueName]),
      }));
    };
    modDB.map(getMod);
  }, []);

  return modList;
}

export default useModMap;
