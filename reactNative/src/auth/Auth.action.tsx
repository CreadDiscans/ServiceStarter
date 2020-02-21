import { getHandleActions } from "../core/connection"
import * as ApiType from '../types/api.types';
import * as CustomType from '../types/custom.types';
import { Api } from "../core/Api";

export type AuthState = {
    profile?:ApiType.Profile
    fcmToken?:string
}

const initState:AuthState = {

}

export const AuthAction = {
    setFcm:async(profile:ApiType.Profile|undefined, fcmToken:string)=> {
        if (profile) {
          const devices = await Api.list<ApiType.Device[]>('/api-device/', {
            profile:profile.id,
            type:'android'
          })
          if (devices.length === 0) {
            await Api.create<ApiType.Device>('/api-device/',{
              fcm_token:fcmToken,
              profile:profile.id,
              type:'android'
            })
          } else {
            await Api.patch<ApiType.Device>('/api-device/',devices[0].id, {
              fcm_token:fcmToken
            })
          }
        }
        return Promise.resolve({fcmToken, userProfile:profile})
      },
      signIn: async(username:string, password:string, fcmToken:string|undefined=undefined) => {
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
        if (!jwt.token) return Promise.reject('password wrong')
        Api.signIn(profile[0], {username, password, token: jwt.token})
        if (fcmToken) {
          await AuthAction.setFcm(profile[0], fcmToken)
        }
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
      socialSign: async (sns:string, uid:string, name:string, token:string, fcmToken:string|undefined)=> {
        const res = await Api.create<{token:string, profile:ApiType.Profile}>('/social/', {
          uid:uid,
          sns:sns,
          name:name,
          token:token,
          fcm_token:fcmToken,
          type:'android'
        })
        console.log(res)
        Api.signIn(res.profile, {username:sns+'@'+uid, password:uid, token:res.token})
        return Promise.resolve({userProfile:res.profile})
      }
}

export default getHandleActions(AuthAction, initState)