import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';

import modules from 'app/Reducers';
import * as ApiType from 'types/api.types';

declare var window:any;
declare var module:any;
const isDevelopment = process.env.NODE_ENV === 'development';

const composeEnhancers = isDevelopment ? (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose) : compose;

const initState = () => {
  let userProfile:ApiType.Profile|undefined;
  if (typeof localStorage === 'undefined') {
    userProfile = undefined;
  } else {
    const str = localStorage.getItem('user_profile')
    userProfile = str? JSON.parse(str):undefined
  }
  return userProfile
}

const configureStore = (initialState:any) => {
  if (initialState === undefined) initialState = {}
  if (initialState.auth === undefined) initialState.auth = {}
  initialState.auth.userProfile = initState();
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

export default configureStore