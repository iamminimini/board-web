import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppProvider from '@atlaskit/app-provider';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'; // React Query import 추가

import './i18n'; // i18n

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    {/* QueryClientProvider로 AppProvider와 BrowserRouter를 감쌈 */}
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
