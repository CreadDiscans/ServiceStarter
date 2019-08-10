import asyncRoute from 'app/core/asyncRoute';

export const Home = asyncRoute(() => import('home/Home'));
export const SingIn = asyncRoute(() => import('auth/SignIn'));
export const SignUp = asyncRoute(() => import('auth/SignUp'));
export const About = asyncRoute(() => import('home/About'));