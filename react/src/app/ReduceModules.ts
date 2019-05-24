import { combineReducers } from 'redux';
import users from 'users/Users.action';
import { penderReducer } from 'redux-pender';

export default combineReducers({
  users,
  pender: penderReducer
})