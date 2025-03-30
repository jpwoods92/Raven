import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import AppRouter from './components/Router';
import { store } from './store';
import '@/stylesheets/index.scss';

export const Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);
