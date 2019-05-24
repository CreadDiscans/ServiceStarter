import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';

import modules from 'app/ReduceModules';

declare var window:any;
declare var module:any;
const isDevelopment = process.env.NODE_ENV === 'development';

const composeEnhancers = isDevelopment ? (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose) : compose;

const configureStore = (initialState:any) => {
  const store = createStore(modules, initialState, composeEnhancers(
    applyMiddleware(penderMiddleware())
  ));
  if(module.hot) {
    module.hot.accept('./ReduceModules', ()=> {
      const nextRootReducer = require('./ReduceModules').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}

export default configureStore;