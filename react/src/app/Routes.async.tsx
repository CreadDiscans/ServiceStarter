import asyncRoute from 'app/core/asyncRoute';

export const Home = asyncRoute(() => import('home/Home'));
export const SingIn = asyncRoute(() => import('auth/SignIn'));
export const SignUp = asyncRoute(() => import('auth/SignUp'));
export const Activation = asyncRoute(() => import('auth/Activation'));
export const Reset = asyncRoute(() => import('auth/Reset'));