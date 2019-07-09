import { combineReducers, Dispatch, bindActionCreators } from 'redux';
import user, { UserState, userActions, UserAction } from 'users/Users.action';
import { penderReducer } from 'redux-pender';

import auth, { AuthState, AuthAction, authActions } from 'auth/Auth.action';
import { connect } from 'react-redux';
import React from 'react';
import { withDone } from 'react-router-server';
import { History, Location } from 'history';
import { match, withRouter } from 'react-router';

export default combineReducers({
  auth,
  user,
  pender: penderReducer
})

export type RootState = {
  auth: AuthState;
  user: UserState;
}

export type RootAction = {
  AuthAction: typeof AuthAction;
  UserAction: typeof UserAction;
}

export type Props = {
  data: RootState;
  done: Function;
  history: History;
  location: Location;
  match: match;
} & RootAction;

export const connection = (component:typeof React.Component) => 
  // @ts-ignore  
  withRouter(withDone(connect(
    (state:RootState)=>({data:state}),
    (dispatch:Dispatch) => ({
      AuthAction: bindActionCreators(authActions, dispatch),
      UserAction: bindActionCreators(userActions, dispatch)
    }))(component)))