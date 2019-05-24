import { combineReducers } from 'redux';
import users from 'users/Users.action';
import { penderReducer } from 'redux-pender';

import auth from 'auth/Auth.action';

export default combineReducers({
  auth,
  users,
  pender: penderReducer
})