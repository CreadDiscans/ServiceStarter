import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';

import auth, { AuthState } from 'auth/Auth.action';
import board, { BoardState } from 'board/Board.action';
import dashboard, { DashboardState } from 'dashboard/Dashboard.action';
import mypage, { MypageState } from 'mypage/Mypage.action';
import shared, { SharedState } from 'component/Shared.action';
export default combineReducers({
  auth,
  board,
  dashboard,
  mypage,
  shared,
  pender: penderReducer
})

export type RootState = {
  auth: AuthState;
  board: BoardState;
  dashboard: DashboardState;
  mypage: MypageState;
  shared: SharedState
}
