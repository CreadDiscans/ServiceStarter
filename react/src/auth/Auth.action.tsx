import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { getHandleActions } from 'app/core/connection';
import * as CustomType from 'types/custom.types';

export type AuthState = {
  userProfile?:ApiType.Profile
}

const initState:AuthState = {
  userProfile: undefined
};

export const AuthAction = {
  signIn: async(username:string, password:string) => {
    const res = await Api.list<{username:boolean, email:boolean}>('/api-user/',{
      username:username
    })
    if (!res.username) return Promise.reject('no user')
    const profile = await Api.list<ApiType.Profile[]>('/api-profile/', {
      user__username:username
    })
    if (profile.length === 0) return Promise.reject('not activate')
    const jwt = await Api.create<{token:string}>('/api/token-auth/', {
      username:username,
      password:password
    }).catch(err=>  ({token:null}))
    if (jwt.token === null) return Promise.reject('password wrong')
    Api.signIn(jwt.token, profile[0])
    return Promise.resolve({userProfile: profile[0]})
  },
  signOut: async ()=>{
    Api.signOut();
    return Promise.resolve({userProfile:undefined})
  },
  signUp: async(username:string, email:string, password:string)=> {
    return Api.create<CustomType.auth.User>('/api-user/', {
      username:username,
      email:email,
      password:password
    }).then(res=> ({}))
  },
  socialSign: async (sns:string, uid:string, name:string, token:string)=> {
    await Api.update('/api-user/', 0, {
      uid:uid,
      sns:sns,
      name:name,
      token:token
    })
    return AuthAction.signIn(sns+'@'+uid, token)
  }
}

export default getHandleActions(AuthAction, initState)