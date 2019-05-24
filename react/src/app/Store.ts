import configureStore from './ConfigureStore';
declare var window:any;

export default configureStore(window.__PRELOADED_STATE__);