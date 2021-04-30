import axios from "axios"
import { HYDRATE } from "next-redux-wrapper"
import { Action } from "redux"
import { all, call, fork, takeEvery } from "redux-saga/effects"
import { Api } from "../../core/Api"
import { injectReducers, injectSaga } from "../../core/redux/store"
import { U } from "../../core/U"

export type AuthState = {
    
}

const initialState:AuthState = {

}

const SIGNIN = 'SIGNIN'

export const signin = (username:string, password:string) => ({type:SIGNIN, username, password})

function* singin_worker({username, password}:{type:string, username:string, password:string}) {
    const {status, data} = yield call(Api.create, '/api/token-auth/', {username, password})
    console.log(status, data)
}

export function* authSaga() {
    yield takeEvery(SIGNIN, singin_worker)
}

export const authReducer = (state=initialState, action:Action) => {
    switch(action.type) {
        case HYDRATE:
            console.log('hydrate')
            return {...state}
        case SIGNIN:
            console.log('signin reducer')
            return {...state}
        default:
            return {...state}
    }
}

export const init = ()=> {
    injectReducers('auth', authReducer)
    injectSaga('auth', authSaga)
}

export default U.redirect('signin')