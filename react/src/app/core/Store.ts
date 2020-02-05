import configureStore from "./configureStore";
declare var window:any;

export const store = configureStore(window.__PRELOADED_STATE__);
