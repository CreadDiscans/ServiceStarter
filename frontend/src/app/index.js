import asyncRoute from 'lib/asyncRoute';

export const Main = asyncRoute(() => import('./main/Main'));


// theme
export const ThemeHeader = asyncRoute(() => import('./theme/layout/ThemeHeader'));
export const ThemeFooter = asyncRoute(() => import('./theme/layout/ThemeFooter'));
export const ThemeContent = asyncRoute(() => import('./theme/layout/ThemeContent'));

export const ThemeBoardDetail = asyncRoute(() => import('./theme/board/ThemeBoardDetail'));
export const ThemeBoardEditor = asyncRoute(() => import('./theme/board/ThemeBoardEditor'));
export const ThemeBoardList = asyncRoute(() => import('./theme/board/ThemeBoardList'));

// theme test
export const ThemeTest = asyncRoute(() => import('./theme/ThemeTest'));
export const ThemeBoardDetailTest = asyncRoute(() => import('./theme/board/ThemeBoardDetailTest'));
export const ThemeBoardEditorTest = asyncRoute(() => import('./theme/board/ThemeBoardEditorTest'));
export const ThemeBoardListTest = asyncRoute(() => import('./theme/board/ThemeBoardListTest'));

// data test
export const DataTest = asyncRoute(() => import('./data/DataTest'));
export const DataTestBoard = asyncRoute(() => import('./data/DataTestBoard'));