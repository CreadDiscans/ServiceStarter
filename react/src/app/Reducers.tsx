import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';
import { AuthState } from 'auth/Auth.action';
import board, { BoardState } from 'board/Board.action';
import dashboard, { DashboardState } from 'dashboard/Dashboard.action';
import mypage, { MypageState } from 'mypage/Mypage.action';
import shared, { SharedState } from 'component/Shared.action';

export default (asyncReducers={}) => combineReducers({
  board,
  dashboard,
  mypage,
  shared,
  pender: penderReducer,
  ...asyncReducers
})

export type RootState = {
  auth: AuthState;
  board: BoardState;
  dashboard: DashboardState;
  mypage: MypageState;
  shared: SharedState
}
