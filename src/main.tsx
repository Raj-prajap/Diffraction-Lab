import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { DiffractionLabProvider } from './context/DiffractionLabContext';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <DiffractionLabProvider>
        <App />
      </DiffractionLabProvider>
    </React.StrictMode>
  );
}
