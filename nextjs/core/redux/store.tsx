import { createStore, applyMiddleware, Middleware, combineReducers } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'

import { all, fork } from 'redux-saga/effects'
import sagaUsers from './sagas/sagaUsers'
import sampledata from './reducers/sampledata'
import counter from './reducers/counter'


function* rootSaga() {
  yield all(Object.values(sagas).map((saga:any)=> fork(saga)))
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

const reducers:any = {sampledata, counter}
const sagas:any = {users:sagaUsers}
const context:any = {store:undefined}

export const injectReducers = (key:string, reducer:any) => {
  reducers[key] = reducer
  if (context.store !== undefined) {
    context.store.injectReducer(key, reducer)
  }
}
export const injectSaga = (key:string, saga:any) => {
  sagas[key] = saga 
  if (context.store !== undefined) {
    context.store.injectSaga(key, saga)
  }
}

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const store:any = createStore(createReducer(reducers), bindMiddleware([sagaMiddleware]))
  // store.sagaTask = sagaMiddleware.run(rootSaga)
  context.store = store
  store.injectSaga = createSagaInjector(sagaMiddleware.run, rootSaga)

  const asyncReducers:any = reducers
  store.injectReducer = (key:string, reducer:any) => {
    asyncReducers[key] = reducer
    store.replaceReducer(createReducer(asyncReducers))
  }
  return store
}

export const wrapper = createWrapper(makeStore, { debug: false })

function createSagaInjector(runSaga:any, rootSaga:any) {
  const injectedSaga = new Map()
  const isInjected = (key:string) => injectedSaga.has(key);
  const injectSaga = (key:string, saga:any) => {
    if(isInjected(key)) return;
    const task = runSaga(saga)
    context.store.sagaTask = task
    injectedSaga.set(key, task)
  }
  injectSaga('root', rootSaga)
  return injectSaga
}