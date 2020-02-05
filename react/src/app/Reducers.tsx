import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import auth, { AuthState } from 'auth/Auth.action';
import board, { BoardState } from 'board/Board.action';
export default combineReducers({
  auth,
  board,
  pender: penderReducer
})

export type RootState = {
  auth: AuthState;
  board: BoardState;
}
