import { useState, useEffect } from 'react';

import modDB from '../mod-db.json';
import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';

function useModList() {
  const [modList, setModList] = useState<Mod[]>([]);

  useEffect(() => {
    setModList(getLocalMods);
  }, [])

  useEffect(() => {
    const getMod = async (modDbItem: ModDbItem) => {
      const remoteMod = await getRemoteMod(modDbItem);
      setModList(mods => ([
        ...mods,
        remoteMod,
      ]));
    };

    modDB.map(getMod);

  }, []);

  return modList;
}

export default useModList;
