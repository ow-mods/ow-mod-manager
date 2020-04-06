import { useState, useEffect } from 'react';

import getLocalMods from '../services/get-local-mods';

function useModList() {
  const [modList, setModList] = useState<Mod[]>([]);

  useEffect(() => {
    setModList(getLocalMods);
  }, [])

  return modList;
}

export default useModList;
