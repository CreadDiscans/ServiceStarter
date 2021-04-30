import { getHandleActions } from "../core/connection"
import * as ApiType from '../types/api.types';
import * as CustomType from '../types/custom.types';
import { Api } from "../core/Api";
import DeviceInfo from 'react-native-device-info';
import { Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { store } from "../core/Store";
import { put, takeEvery } from "@redux-saga/core/effects";
import { call } from "redux-saga/effects";

const deviceType = Platform.OS + ':' + DeviceInfo.getDeviceId()

export type AuthState = {
    profile?:ApiType.Profile
    fcmToken?:string
}

const initState:AuthState = {

}

export const AuthAction = {
    name:'auth',
    init:async()=>{
      const profile = await AsyncStorage.getItem('profile')
      if (profile) return Promise.resolve({profile:JSON.parse(profile)})
      return Promise.resolve({profile:undefined})
    },
    setFcm:async(profile:ApiType.Profile|undefined, fcmToken:string)=> {
        if (profile) {
          const devices = await Api.list<ApiType.Device[]>('/api-device/', {
            profile:profile.id,
            type:deviceType
          })
          if (devices.length === 0) {
            await Api.create<ApiType.Device>('/api-device/',{
              fcm_token:fcmToken,
              profile:profile.id,
              type:deviceType
            })
          } else {
            await Api.patch<ApiType.Device>('/api-device/',devices[0].id, {
              fcm_token:fcmToken
            })
          }
        }
        return Promise.resolve({fcmToken, profile})
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
        const jwt = await Api.create<{token:string, refresh_token:string}>('/api/token-auth/', {
          username:username,
          password:password,
          type:deviceType
        }).catch(err=>  ({token:null}))
        if (!jwt.token) return Promise.reject('password wrong')
        Api.signIn(profile[0], jwt.token, jwt.refresh_token)
        if (fcmToken) {
          await AuthAction.setFcm(profile[0], fcmToken)
        }
        return Promise.resolve({profile: profile[0]})
      },
      signOut: async()=>{
        const devices = await Api.list<ApiType.Device[]>('/api-device/', {
          type:deviceType
        })
        if (devices.length > 0) {
          await Api.patch<ApiType.Device>('/api-device/', devices[0].id, {
            fcm_token:'notoken'
          })
        }
        Api.signOut();
        return Promise.resolve({profile:undefined})
      },
      signUp: async(username:string, email:string, password:string)=> {
        return Api.create<CustomType.auth.User>('/api-user/', {
          username:username,
          email:email,
          password:password
        }).then(res=> ({}))
      },
      socialSign: async (sns:string, uid:string, name:string, email:string|undefined, token:string, fcmToken:string|undefined)=> {
        const res = await Api.create<{token:string, profile:ApiType.Profile, refresh_token:string}>('/social/', {
          uid:uid,
          sns:sns,
          name:name,
          email:email,
          token:token,
          fcm_token:fcmToken,
          type:deviceType
        })
        Api.signIn(res.profile, res.token, res.refresh_token)
        return Promise.resolve({profile:res.profile})
      }
}

const SIGNIN = 'auth.SIGNIN'
const INIT = 'auth.INIT'
const SET_PROFILE = 'auth.SET_PROFILE'

export const signin = (username:string, password:string) => ({type:SIGNIN, username, password}) 
export const init = () => ({type:INIT})

function* signin_worker({username, password}:{type:string, username:string, password:string}) {

}

function* init_worker() {
  const profile:undefined|ApiType.Profile = yield call(AsyncStorage.getItem, 'profile')
  yield put({type:SET_PROFILE, profile})
}

function* authSaga() {
  yield takeEvery(SIGNIN, signin_worker)
  yield takeEvery(INIT, init_worker)
}

const reducer = (state:AuthState=initState, action:any) => {
  switch(action.type) {
    case SET_PROFILE:
      return {profile:action.profile, ...state}
    default:
      return {...state}
  }
}

// store.injectReducer(AuthAction, initState)
store.injectReducer('auth', reducer)
store.injectSaga('auth', authSaga)
