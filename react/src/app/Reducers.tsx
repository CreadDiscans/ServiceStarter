import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import auth from 'auth/Auth.action';
import { AuthState } from 'auth/Auth.type';

export default combineReducers({
  auth,
  pender: penderReducer
})

export type RootState = {
  auth: AuthState;
}
