import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';
import home, { HomeState } from '../home/Home.action';
import auth, { AuthState } from '../auth/Auth.action';
export default combineReducers({
    home,
    auth,
    pender:penderReducer
})

export type RootState = {
    home:HomeState
    auth:AuthState
}
