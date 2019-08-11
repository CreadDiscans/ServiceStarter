import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import { AuthState } from './Auth.type';
import { Api } from 'app/core/Api';

const AUTH_SIGNIN = 'AUTH_SIGNIN';
const AUTH_SIGNUP = 'AUTH_SIGNUP';
const AUTH_SIGNOUT = 'AUTH_SIGNOUT';

let user_id;
if (typeof localStorage === 'undefined') {
  user_id = undefined;
} else {
  user_id = localStorage.getItem('user_id')? Number(localStorage.getItem('user_id')):undefined
}

const initState:AuthState = {
  user_id: user_id
};

export const AuthAction = {
  signIn: (username:string, password:string) => {
    return Api.create('/api/token-auth/', {
      username:username,
      password:password
    }).then(res=> {
      Api.signIn(res.token, 0);
      return Api.list('/api-user/', {self:true})
      .then(res2=> new Promise(resolve=> {
        Api.signIn(res.token, res2.id);
        resolve(res2.id);
      }))
    })
  },
  signUp: (username:string, email:string, password:string) => {
    return Api.create('/api-user/', {
      username:username,
      email:email,
      password:password
    }).then(res=> Api.create('/api-profile/', {
      user: res.id
    }))
  },
  signOut:()=>{}
}

export const authActions = {
  signIn: createAction(AUTH_SIGNIN, AuthAction.signIn),
  signUp: createAction(AUTH_SIGNUP, AuthAction.signUp),
  signOut: createAction(AUTH_SIGNOUT)
}

export default handleActions({
  [AUTH_SIGNOUT]: (state:AuthState, {payload}) => {
    Api.signOut();
    return {
      ...state,
      user_id: undefined
    }
  },
  ...pender({
    type:AUTH_SIGNIN,
    onSuccess: (state: AuthState, {payload})=> ({
      ...state,
      user_id: payload
    }),
    // onPending: (state, action) => {}
    // onError: (state, action) => {}
  })
}, initState);