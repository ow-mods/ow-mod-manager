import { useState, useEffect } from 'react';

import modDB from '../mod-db.json';
import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';

function useModList() {
  const [modList, setModList] = useState<ModMap>({});

  useEffect(() => {
    const getMods = async () => {
      const localMods = await getLocalMods();
      setModList(mods =>({
        ...mods,
        ...localMods
      }));
    }
    getMods();
  }, [])

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      const remoteMod = await getRemoteMod(modDbItem);
      setModList(mods => ({
        ...mods,
        [remoteMod.uniqueName]: {
          ...remoteMod,
          ...mods[remoteMod.uniqueName],
        },
      }));
    };
    modDB.map(getMod);
  }, []);

  return modList;
}

export default useModList;
