import {compose, applyMiddleware, createStore } from 'redux';
import modules from './Reducer';
import penderMiddleware from 'redux-pender';

const configureStore = (initialState:any) => {
    const store = createStore(modules, initialState, compose(
        applyMiddleware(penderMiddleware())
    ));
    return store
}

export default configureStore