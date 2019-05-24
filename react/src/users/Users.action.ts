import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'users/Users.api';

const GET_USERS = 'users/GET_USERS';

export const getUsers = createAction(GET_USERS, api.getUsers);

const initialState = {
  data:[]
};

export default handleActions({
  ...pender({
    type: GET_USERS,
    onSuccess: (state, action) => {
      return {
        data: action.payload.data
      }
    }
  })
}, initialState);