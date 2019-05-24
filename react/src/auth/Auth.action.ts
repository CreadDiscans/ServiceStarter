import { createAction, handleActions } from 'redux-actions';
import * as api from 'auth/Auth.api';
import { pender } from 'redux-pender';

const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGOUT = 'LOGOUT';

export const login = createAction(LOGIN_REQUEST, api.tokenAuth); // username, password
export const logout = createAction(LOGOUT);

const initialState = {
  auth: {
    isLoggedIn: false,
    token: undefined,
    user: {}
  }
};

export default handleActions({
  [LOGOUT]: (state, action) => {
    return {
      ...state,
      auth: {
        isLoggedIn: false,
        token: undefined,
        user: {}
      }
    }
  },
  ...pender({
    type:LOGIN_REQUEST,
    onSuccess: (state, {payload})=> {
      return {
        ...state,
        auth: {
          isLoggedIn: true,
          token: payload[1].data.token,
          user: payload[0].data
        }
      }
    },
    // onPending: (state, action) => {}
    // onError: (state, action) => {}
  })
}, initialState)