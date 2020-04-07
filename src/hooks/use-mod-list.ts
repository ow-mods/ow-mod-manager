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
    const getMod = async (repo: string) => {
      const remoteMod = await getRemoteMod(repo);
      setModList(mods => ([
        ...mods,
        remoteMod,
      ]))
    };

    modDB.map(modDbItem => getMod(modDbItem.repo));

  }, []);

  return modList;
}

export default useModList;
