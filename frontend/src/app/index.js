import asyncRoute from 'lib/asyncRoute';

export const Home = asyncRoute(() => import('./home/Home'));
export const Header = asyncRoute(() => import('./home/Header'));
export const Footer = asyncRoute(() => import('./home/Footer'));
