import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';
import * as ApiType from 'types/api.types';
import { getHandleActions } from './connection';
import createReducer from '../Reducers';

declare var window:any;
declare var module:any;
const isDevelopment = process.env.NODE_ENV === 'development';

const composeEnhancers = isDevelopment ? (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose) : compose;

const configureStore = (initialState:any) => {
  if (initialState === undefined) initialState = {}
  
  const store:any = createStore(
    createReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(penderMiddleware())
    )
  );
  store.asyncReducers = {}

  if(module.hot) {
    module.hot.accept('../Reducers', ()=> {
      const nextRootReducer = require('../Reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  
  store.injectReducer = (actions, initState) => {
    const asyncReducer = getHandleActions(actions, initState)
    store.asyncReducers[actions.name] = asyncReducer
    store.replaceReducer(createReducer(store.asyncReducers))
  }
  return store;
}

export default configureStore