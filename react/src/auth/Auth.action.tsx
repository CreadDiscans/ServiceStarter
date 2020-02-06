import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { getHandleActions } from 'app/core/connection';

export type AuthState = {
  userProfile?:ApiType.Profile
}

const initState:AuthState = {
  userProfile: undefined
};

export const AuthAction = {
  signIn: async (args:{token:string, profile:ApiType.Profile}) => {
    Api.signIn(args.token, args.profile)
    return Promise.resolve({userProfile: args.profile})
  },
  signOut: async ()=>{
    Api.signOut();
    return Promise.resolve({userProfile:undefined})
  }
}

export default getHandleActions(AuthAction, initState)