import React, { useEffect, useState } from 'react';

import getRemoteMod from '../services/get-remote-mod';

type Props = {
  repo: string;
}

const ModItem: React.FunctionComponent<Props> = ({ repo }) => {
  const [mod, setMod] = useState<Mod>();

  useEffect(() => {
    const getMod = async () => {
      setMod(await getRemoteMod(repo));
    };
    getMod();
  }, [repo]);
    return <div>{mod ? mod.name : 'loading'}</div>;
};

export default ModItem;
