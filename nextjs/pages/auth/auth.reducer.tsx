import { all, fork, takeEvery } from "redux-saga/effects"
import { U } from "../../core/U"
import Sigin from './signin'

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

function* authSaga() {
    yield all([
        fork(watchValue)
    ])
}

const reducer = (state=initialState, action:any) => {
    switch(action.type) {
        case 'AAA':
            return {...state}
    }
}

export default U.redirect('signin')