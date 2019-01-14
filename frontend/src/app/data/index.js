import asyncRoute from 'lib/asyncRoute';

export const DataTestBoard = asyncRoute(() => import('./data/DataTestBoard'));

export const DataTestBoardComment2 = asyncRoute(() => import('./data/board2/DataTestBoardComment2'));
export const DataTestBoardGroup2 = asyncRoute(() => import('./data/board2/DataTestBoardGroup2'));
export const DataTestBoardItem2 = asyncRoute(() => import('./data/board2/DataTestBoardItem2'));
export const DataTestBoard2Comment = asyncRoute(() => import('./data/board2/DataTestBoard2Comment'));
export const DataTestBoard2Group = asyncRoute(() => import('./data/board2/DataTestBoard2Group'));
export const DataTestBoard2Item = asyncRoute(() => import('./data/board2/DataTestBoard2Item'));
// data test inserted automatically