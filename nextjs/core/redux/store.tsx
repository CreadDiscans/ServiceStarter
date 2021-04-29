import { createStore, applyMiddleware, Middleware, combineReducers } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware, { Task } from 'redux-saga'

import rootReducer from './reducers/index'
import { all } from 'redux-saga/effects'
import counter from './reducers/counter'
// import rootSaga from './sagas'


function* rootSaga() {
  // yield all([fork(sagaUsers)])
  yield all([])
}

function createReducer(asyncReducers:any) {
  return combineReducers({
    ...asyncReducers
  })
}

const bindMiddleware = (middleware: Middleware[]) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const reducers:any = {}
export const injectReducers = (key:string, reducer:any) => {
  reducers[key] = reducer
}

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const store:any = createStore(createReducer(reducers), bindMiddleware([sagaMiddleware]))
  // store.sagaTask = sagaMiddleware.run(rootSaga)
  store.injectSaga = createSagaInjector(sagaMiddleware.run, rootSaga)

  return store
}
export const wrapper = createWrapper(makeStore, { debug: false })

function createSagaInjector(runSaga:any, rootSaga:any) {
  const injectedSaga = new Map()
  const isInjected = (key:string) => injectedSaga.has(key);
  const injectSaga = (key:string, saga:any) => {
    if(isInjected(key)) return;
    const task = runSaga(saga)
    injectedSaga.set(key, task)
  }
  injectSaga('root', rootSaga)
  return injectSaga
}