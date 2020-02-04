import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import auth, { AuthState } from 'auth/Auth.action';

export default combineReducers({
  auth,
  pender: penderReducer
})

export type RootState = {
  auth: AuthState;
}
