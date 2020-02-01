import { createStore, applyMiddleware, compose } from 'redux';
import penderMiddleware from 'redux-pender';

import modules from 'app/Reducers';

declare var window:any;
declare var module:any;
const isDevelopment = process.env.NODE_ENV === 'development';

const composeEnhancers = isDevelopment ? (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose) : compose;

const initState = () => {
  let user_id;
  if (typeof localStorage === 'undefined') {
    user_id = undefined;
  } else {
    user_id = localStorage.getItem('user_id')? Number(localStorage.getItem('user_id')):undefined
  }
  return user_id
}

const configureStore = (initialState:any) => {
  if (initialState && initialState.auth) {
    initialState.auth.user_id = initState();
  }
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