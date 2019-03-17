import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import mockWebSocketServer from './core/mockWebSocketServer';
import webSocketConnection from './core/webSocketConnection';

import rootReducer from './rootReducer';

import App from './App';

import './index.css';

if (process.env.REACT_APP_USE_MOCK_SERVER === 'true') {
  // Mock server for dev purposes. Will use actual API in prod.
  mockWebSocketServer.init();
}

webSocketConnection.init();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunk.withExtraArgument({ sendMessage: webSocketConnection.sendMessage }),
    ),
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
