import { all, call, put, takeLatest } from 'redux-saga/effects'
import axios, { AxiosResponse } from 'axios'

import { failure, loadDataSuccess } from '../actions/sampledata'
import { actionTypesSampleData, User } from '../../interfaces'

function* loadDataUsers() {
  try {
    const { status, data }: AxiosResponse<User[]> = yield call(axios.get, 'https://jsonplaceholder.typicode.com/users')

    if (status === 200) {
      yield put(loadDataSuccess(data))
    }
  } catch (err) {
    yield put(failure(err))
  }
}

// 감시자
function* sagaUsers(): Generator {
  yield takeLatest(actionTypesSampleData.LOAD_DATA, loadDataUsers)
}

export default sagaUsers
