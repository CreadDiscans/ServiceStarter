import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';

import modules from 'app/Reducers';

declare var window:any;
declare var module:any;
const isDevelopment = process.env.NODE_ENV === 'development';

const composeEnhancers = isDevelopment ? (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose) : compose;

export const configureStore = (initialState:any) => {
  const store = createStore(modules, initialState, composeEnhancers(
    applyMiddleware(penderMiddleware())
  ));
  if(module.hot) {
    module.hot.accept('../Reducers', ()=> {
      const nextRootReducer = require('../Reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}

// export const store = configureStore(window.__PRELOADED_STATE__);
export const store = configureStore(undefined);