import { useState, useEffect } from 'react';

import modUrlList from '../mod-list.json';
import getLocalMods from '../services/get-local-mods';
import getRemoteMod from '../services/get-remote-mod';

function useModList() {
  const [modList, setModList] = useState<Mod[]>([]);

  useEffect(() => {
    setModList(getLocalMods);
  }, [])

  useEffect(() => {
    const getMod = async (url: string) => {
      const remoteMod = await getRemoteMod(url);
      setModList(mods => ([
        ...mods,
        remoteMod,
      ]))
    };

    modUrlList.map(getMod);

  }, []);

  return modList;
}

export default useModList;
