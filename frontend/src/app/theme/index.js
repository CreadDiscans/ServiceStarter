import asyncRoute from 'lib/asyncRoute';

export const BSAlertTest = asyncRoute(() => import('./bootstrap/BSAlert.test'));