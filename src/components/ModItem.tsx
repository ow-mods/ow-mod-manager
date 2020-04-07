import React, { useEffect, useState } from 'react';

import getRemoteMod from '../services/get-remote-mod';
import { Mod } from '../mod';

type Props = {
  modDbItem: ModDbItem;
}

const ModItem: React.FunctionComponent<Props> = ({ modDbItem }) => {
  const [mod, setMod] = useState<Mod>();

  useEffect(() => {
    const getMod = async () => {
      setMod(await getRemoteMod(modDbItem));
    };
    getMod();
  }, [modDbItem]);
    return <div>{mod ? mod.manifest.name : 'loading'}</div>;
};

export default ModItem;
