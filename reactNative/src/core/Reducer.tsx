import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';
import home, { HomeState } from '../home/Home.action';
import { AuthState } from '../auth/Auth.action';
export default (asyncReducers = {}) => combineReducers({
    home,
    pender:penderReducer,
    ...asyncReducers
})

export type RootState = {
    home:HomeState
    auth:AuthState
}
