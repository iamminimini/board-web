// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppProvider from '@atlaskit/app-provider';
import { BrowserRouter } from 'react-router-dom';

import './i18n'; // i18n

// React 16.14.0에서는 createRoot 대신 render 사용
ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
