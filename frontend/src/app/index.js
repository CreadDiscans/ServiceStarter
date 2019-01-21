import asyncRoute from 'lib/asyncRoute';

export const Main = asyncRoute(() => import('./main/Main'));
export const ThemeTest = asyncRoute(() => import('./theme/ThemeTest'));

// theme
export const ThemeHeader = asyncRoute(() => import('./theme/layout/ThemeHeader'));
export const ThemeFooter = asyncRoute(() => import('./theme/layout/ThemeFooter'));
export const ThemeContent = asyncRoute(() => import('./theme/layout/ThemeContent'));

