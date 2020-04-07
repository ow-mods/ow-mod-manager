import { useState, useEffect } from 'react';

import modDB from '../mod-db.json';
import getLocalManifests from '../services/get-local-manifests';
import getRemoteMod from '../services/get-remote-mod';
import { Mod } from '../models/mod';
import { ModDbItem } from '../models/mod-db-item';

function useModList() {
  const [modList, setModList] = useState<Mod[]>([]);

  useEffect(() => {
    const localMods: Mod[] = getLocalManifests().map<Mod>(manifest => {
      const mod = new Mod();
      mod.localManifest = manifest;
      return mod;
    });
    setModList(localMods);
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
