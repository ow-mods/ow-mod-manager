import { hot } from 'react-hot-loader/root';
import React from 'react';
import ModList from './ModList';
import { Test } from './Test';

const App = () => (
  <div>
    <Test />
    <ModList />
  </div>
)

export default hot(App);
