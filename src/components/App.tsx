import React from 'react';

import modList from '../mod-list.json';
import Mod from './Mod';

console.log('puta');

const App = () => (
  <div>
    { modList.map(repo => (
      <Mod
        key={repo}
        repo={repo}
      />
    ))}
  </div>
);

export default App;
