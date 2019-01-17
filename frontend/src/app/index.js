import asyncRoute from 'lib/asyncRoute';

export const Main = asyncRoute(() => import('./main/Main'));
export const ThemeTest = asyncRoute(() => import('./theme/ThemeTest'));
export const DataTest = asyncRoute(() => import('./data/DataTest'));


// theme
export const ThemeHeader = asyncRoute(() => import('./theme/layout/ThemeHeader'));
export const ThemeFooter = asyncRoute(() => import('./theme/layout/ThemeFooter'));
export const ThemeContent = asyncRoute(() => import('./theme/layout/ThemeContent'));

export const BSAlert = asyncRoute(() => import('./theme/bootstrap/BSAlert'));
