import axios from "axios"
import { HYDRATE } from "next-redux-wrapper"
import { Action } from "redux"
import { all, call, fork, put, takeEvery } from "redux-saga/effects"
import { Api } from "../../core/Api"
import { injectReducers, injectSaga } from "../../core/redux/store"
import { U } from "../../core/U"
import { Profile } from "../../types/api.types"
import { auth } from "../../types/custom.types"

export type AuthState = {
    profile?:Profile<auth.User>
}

const initialState:AuthState = {

}

const SIGNIN = 'SIGNIN'
const SET_PROFILE = 'SET_PROFILE'

export const signin = (username:string, password:string) => ({type:SIGNIN, username, password})

function* singin_worker({username, password}:{type:string, username:string, password:string}) {
    try{
        const {data} = yield call(Api.create, '/api/token-auth/', {username, password})
        Api.signIn(data.token)
        try {
            const {data} = yield call(Api.list, '/api-user/', {self:true})
            const user:auth.User = data
            try {
                const {data} = yield call(Api.list, '/api-profile/', {user:user.id})
                const profile:Profile<auth.User> = data[0]
                profile.user = user
                yield put({type:SET_PROFILE, profile})
            } catch{}
        } catch {}
    } catch(e) {
        console.log('fail', e)
    }
}

export function* authSaga() {
    yield takeEvery(SIGNIN, singin_worker)
}

export const authReducer = (state=initialState, action:any) => {
    switch(action.type) {
        case HYDRATE:
            return {...state}
        case SET_PROFILE:
            return {profile:action.profile, ...state}
        default:
            return {...state}
    }
}

export const init = ()=> {
    injectReducers('auth', authReducer)
    injectSaga('auth', authSaga)
}

export default U.redirect('signin')