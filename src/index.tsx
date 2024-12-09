import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter as Router } from 'react-router-dom'; // Импортируем Router

import { Provider } from 'react-redux'; // Импортируем Provider
import store from './services/store'; // Импортируем ваш store

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
