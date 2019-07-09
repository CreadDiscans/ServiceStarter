import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import axios from 'axios';

const GET_USERS = 'users/GET_USERS';

export type UserState = {
  data: Array<UserUser>
}

export type UserUser = {
  id:number;
  name:string;
}

const initState: UserState = {
  data: []
}

export const UserAction = {
  getUsers: () => axios.get('https://jsonplaceholder.typicode.com/users')
}

export const userActions = {
  getUsers: createAction(GET_USERS, UserAction.getUsers)
}

export default handleActions({
  ...pender({
    type: GET_USERS,
    onSuccess: (state, action) => {
      return {
        data: action.payload.data
      }
    }
  })
}, initState);