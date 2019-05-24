import asyncRoute from 'app/asyncRoute';

export const Home = asyncRoute(() => import('home/Home'));
export const About = asyncRoute(() => import('home/About'));
export const Users = asyncRoute(() => import('users/Users'));