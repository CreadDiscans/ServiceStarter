import { compose, applyMiddleware, createStore, Middleware } from 'redux';
import createReducer from './Reducer';
import { getHandleActions } from './connection';
import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

function* rootSaga() {
    yield all([])
}

const configureStore = (initialState: any) => {
    const sagaMiddleware = createSagaMiddleware()
    const store: any = createStore(
        createReducer(),
        initialState,
        // compose(
        applyMiddleware(sagaMiddleware)
        // )
    );

    store.asyncReducers = {};

    store.injectReducer = (key: string, reducer:any) => {
        // const asyncReducer = getHandleActions(actions, initState)
        store.asyncReducers[key] = reducer
        store.replaceReducer(createReducer(store.asyncReducers))
    }
    store.injectSaga = createSagaInjector(sagaMiddleware.run, rootSaga)

    return store
}

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

export default configureStore