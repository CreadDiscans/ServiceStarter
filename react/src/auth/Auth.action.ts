import { createAction } from 'redux-actions';
import * as api from 'auth/Auth.api';

const GET_AUTH = 'auth';

export const getAuth = createAction(GET_AUTH, api.login);