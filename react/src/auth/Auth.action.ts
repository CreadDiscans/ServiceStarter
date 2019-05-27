import { createAction, handleActions } from 'redux-actions';
import * as api from 'auth/Auth.api';
import { pender } from 'redux-pender';

const AUTH_SIGNIN = 'AUTH_SIGNIN';
const AUTH_SIGNUP = 'AUTH_SIGNUP';
const AUTH_SIGNOUT = 'AUTH_SIGNOUT';
const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN';

export const signIn = createAction(AUTH_SIGNIN, api.signIn); // username, password
export const signUp = createAction(AUTH_SIGNUP, api.signUp); // username, email, password
export const signOut = createAction(AUTH_SIGNOUT, api.signOut);
export const setToken = createAction(AUTH_SET_TOKEN, api.setToken); // token

const initialState = {
  isLoggedIn: false,
  token: undefined,
  user: {}
};

export default handleActions({
  [AUTH_SIGNOUT]: () => ({
    isLoggedIn: false,
    token: undefined,
    user: {}
  }),
  ...pender({
    type:AUTH_SIGNIN,
    onSuccess: (state, {payload})=> ({
      isLoggedIn: true,
      token: payload[1].data.token,
      user: payload[0].data
    }),
    // onPending: (state, action) => {}
    // onError: (state, action) => {}
  }),
  ...pender({
    type:AUTH_SET_TOKEN,
    onSuccess: (state, {payload}) => ({
      isLoggedIn: true,
      token: payload[1],
      user: payload[0].data
    })
  })
}, initialState)