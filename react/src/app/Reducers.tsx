import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import auth, { AuthState } from 'auth/Auth.action';
import board, { BoardState } from 'board/Board.action';
import dashboard, { DashboardState } from 'dashboard/Dashboard.action';
import mypage, { MypageState } from 'mypage/Mypage.action';
export default combineReducers({
  auth,
  board,
  dashboard,
  mypage,
  pender: penderReducer
})

export type RootState = {
  auth: AuthState;
  board: BoardState;
  dashboard: DashboardState;
  mypage: MypageState;
}
