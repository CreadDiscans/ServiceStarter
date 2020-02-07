import asyncRoute from 'app/core/asyncRoute';

// Auth
export const SingIn = asyncRoute(() => import('auth/SignIn'));
export const SignUp = asyncRoute(() => import('auth/SignUp'));
export const Activation = asyncRoute(() => import('auth/Activation'));
export const Reset = asyncRoute(() => import('auth/Reset'));
// Home
export const Home = asyncRoute(() => import('home/Home'));
export const Dashboard = asyncRoute(() => import('home/Dashboard'));
// Board
export const Board = asyncRoute(() => import('board/Board'));
// Mypage
export const MyPage = asyncRoute(() => import('mypage/MyPage'));