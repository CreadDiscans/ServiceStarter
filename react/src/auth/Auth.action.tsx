import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';

const AUTH_SIGNIN = 'AUTH_SIGNIN';
const AUTH_SIGNOUT = 'AUTH_SIGNOUT';

export type AuthState = {
  userProfile?:ApiType.Profile
}

const initState:AuthState = {
  userProfile: undefined
};

export const AuthAction = {
  signIn: (args:{token:string, profile:ApiType.Profile}) => {},
  signOut:()=>{}
}

export const authActions = {
  signIn: createAction(AUTH_SIGNIN),
  signOut: createAction(AUTH_SIGNOUT)
}

export default handleActions({
  [AUTH_SIGNOUT]: (state:AuthState, {payload}) => {
    Api.signOut();
    return {
      ...state,
      userProfile: undefined
    }
  },
  [AUTH_SIGNIN]: (state:AuthState, {payload}:any) => {
    Api.signIn(payload.token, payload.profile)
    return {
      ...state,
      userProfile:payload.profile
    }
  }
}, initState);