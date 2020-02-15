import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';
import home, { HomeState } from '../home/Home.action';
export default combineReducers({
    home,
    pender:penderReducer
})

export type RootState = {
    home:HomeState
}
