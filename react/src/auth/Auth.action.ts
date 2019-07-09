import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import axios from 'axios';
declare var csrf_token:string;

const AUTH_SIGNIN = 'AUTH_SIGNIN';
const AUTH_SIGNUP = 'AUTH_SIGNUP';
const AUTH_SIGNOUT = 'AUTH_SIGNOUT';
const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN';

export type AuthState = {
  isLoggedIn:boolean;
  token?:string;
  user?:AuthUser;
}

export type AuthUser = {
  username: string;
  email: string;
}

const initState:AuthState = {
  isLoggedIn: false,
  token: undefined,
  user: undefined
};

export const AuthAction = {
  signIn: (username:string, password:string) => {
    return axios.post('/api/token-auth/', {
      username:username,
      password:password
    }).then(res => {
      axios.defaults.headers.common['Authorization'] = 'JWT ' + res.data.token;
      sessionStorage.setItem('token', res.data.token);
      return Promise.all([axios.get('/api-user/?self=true'), res]);
    }).then(res => {
      return res.map(res=>res.data)
    })
  },

  signUp: (username:string, email:string, password:string) => {
    return axios.post('/api-user/', {
      username:username,
      email:email,
      password:password
    })
    .then(() => AuthAction.signIn(username, password))
    .then((res) => axios.post('/api-profile/', {
      user: res[0].data.id
    }))
    .then(() => delete axios.defaults.headers.common['Authorization'])
  },

  signOut: () => {
    delete axios.defaults.headers.common['Authorization'];
    sessionStorage.removeItem('token');
    Promise.resolve(undefined)
  },

  setToken: (token:string) => {
    axios.defaults.headers.common['X-CSRFToken'] = csrf_token;
    if (token === null) {
      delete axios.defaults.headers.common['Authorization'];
      return Promise.all([null, null]);
    } else {
      axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
      return Promise.all([axios.get('/api-user/?self=true'), token]);
    }
  }
}

export const authActions = {
  signIn: createAction(AUTH_SIGNIN, AuthAction.signIn),
  signUp: createAction(AUTH_SIGNUP, AuthAction.signUp),
  signOut: createAction(AUTH_SIGNOUT, AuthAction.signOut),
  setToken: createAction(AUTH_SET_TOKEN, AuthAction.setToken)
}

export default handleActions({
  ...pender({
    type:AUTH_SIGNOUT,
    onSuccess:(state: AuthState, {payload}) => ({
      isLoggedIn: false,
      token: undefined,
      user: undefined
    })
  }),
  ...pender({
    type:AUTH_SIGNIN,
    onSuccess: (state: AuthState, {payload})=> ({
      isLoggedIn: true,
      token: payload[1].token,
      user: payload[0]
    }),
    // onPending: (state, action) => {}
    // onError: (state, action) => {}
  }),
  ...pender({
    type:AUTH_SET_TOKEN,
    onSuccess: (state: AuthState, {payload}) => ({
      isLoggedIn: true,
      token: payload[1],
      user: payload[0].data
    })
  })
}, initState);