import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Props = {
  repo: string;
}

const Mod: React.FunctionComponent<Props> = ({ repo }) => {
  const [name, setName] = useState('loading...');

  useEffect(() => {
    const getRelease = async () => {
      axios.get(`https://api.github.com/repos/${repo}/releases/latest`)
        .then(response => {
          setName(response.data.name);
        });
    };

    getRelease();
  }, [repo]);
    return <div>{name}</div>;
};

export default Mod;
