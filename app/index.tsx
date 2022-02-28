import React from 'react';
import { createRoot } from 'react-dom';
import App from './components/App';

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('root') as HTMLElement).render(<App />);
});
