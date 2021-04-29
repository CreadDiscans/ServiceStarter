import { HYDRATE } from "next-redux-wrapper"
import { all, fork, takeEvery } from "redux-saga/effects"
import { injectReducers } from "../../core/redux/store"
import { U } from "../../core/U"

export type AuthState = {
    
}

export const initialState:AuthState = {

}

function loadValue() {
    console.log('load value')
    return 2
}

function* watchValue() {
    yield takeEvery('AAA', loadValue)
}

export function* authSaga() {
    yield all([
        fork(watchValue)
    ])
}

export const authReducer = (state=initialState, action:any) => {
    switch(action.type) {
        case HYDRATE:
            console.log('hydrate')
            return {...state}
        case 'AAA':
            return {...state}
        default:
            return {...state}
    }
}
injectReducers('auth',authReducer)

// store
export default U.redirect('signin')