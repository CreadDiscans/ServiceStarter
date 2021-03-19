import { compose, applyMiddleware, createStore } from 'redux';
import createReducer from './Reducer';
import penderMiddleware from 'redux-pender';
import { getHandleActions } from './connection';

const configureStore = (initialState: any) => {
    const store: any = createStore(
        createReducer(),
        initialState,
        compose(
            applyMiddleware(penderMiddleware())
        )
    );

    store.asyncReducers = {};

    store.injectReducer = (actions: any, initState: any) => {
        const asyncReducer = getHandleActions(actions, initState)
        store.asyncReducers[actions.name] = asyncReducer
        store.replaceReducer(createReducer(store.asyncReducers))
    }

    return store
}

export default configureStore