import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { getHandleActions } from 'app/core/connection';
import * as CustomType from 'types/custom.types';
import { store } from "../app/core/Store";

export type AuthState = {
  userProfile?: ApiType.Profile
  fcmToken?: string
}

const initState: AuthState = {
  userProfile: undefined
};

export const AuthAction = {
  name:'auth',
  setFcm: async (profile: ApiType.Profile | undefined, fcmToken: string) => {
    if (profile) {
      const devices = await Api.list<ApiType.Device[]>('/api-device/', {
        profile: profile.id,
        type: 'web'
      })
      if (devices.length === 0) {
        await Api.create<ApiType.Device>('/api-device/', {
          fcm_token: fcmToken,
          profile: profile.id,
          type: 'web'
        })
      } else {
        await Api.patch<ApiType.Device>('/api-device/', devices[0].id, {
          fcm_token: fcmToken
        })
      }
    }
    return Promise.resolve({ fcmToken, userProfile: profile })
  },
  signIn: async (username: string, password: string, fcmToken: string | undefined = undefined) => {
    const res = await Api.list<{ username: boolean, email: boolean }>('/api-user/', {
      username: username
    })
    if (!res.username) return Promise.reject('no user')
    const profile = await Api.list<ApiType.Profile[]>('/api-profile/', {
      user__username: username
    })
    if (profile.length === 0) return Promise.reject('not activate')
    const jwt = await Api.create<{ token: string }>('/api/token-auth/', {
      username: username,
      password: password
    }).catch(err => ({ token: null }))
    if (jwt.token === null) return Promise.reject('password wrong')
    Api.signIn(jwt.token, profile[0])
    if (fcmToken) {
      await AuthAction.setFcm(profile[0], fcmToken)
    }
    return Promise.resolve({ userProfile: profile[0] })
  },
  signOut: async () => {
    Api.signOut();
    return Promise.resolve({ userProfile: undefined })
  },
  signUp: async (username: string, email: string, password: string) => {
    return Api.create<CustomType.auth.User>('/api-user/', {
      username: username,
      email: email,
      password: password
    }).then(res => ({}))
  },
  socialSign: async (sns: string, uid: string, name: string, email: string | undefined, token: string, fcmToken: string | undefined) => {
    const res = await Api.create<{ token: string, profile: ApiType.Profile }>('/social/', {
      sns: sns,
      uid: uid,
      name: name,
      email: email,
      token: token,
      fcm_token: fcmToken,
      type: 'web'
    })
    Api.signIn(res.token, res.profile)
    return Promise.resolve({ userProfile: res.profile })
  }
}

store.injectReducer(AuthAction, initState)
