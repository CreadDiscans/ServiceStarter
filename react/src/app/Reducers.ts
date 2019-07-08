import { combineReducers } from 'redux';
import users from 'users/Users.action';
import { penderReducer } from 'redux-pender';

import auth from 'auth/Auth.action';
import { AuthState } from 'auth/Auth.type';

export default combineReducers({
  auth,
  users,
  pender: penderReducer
})

export interface AppState {
  auth: AuthState
}