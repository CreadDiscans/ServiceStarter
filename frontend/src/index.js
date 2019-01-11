import React from 'react';
import ReactDOM from 'react-dom';
import Root from './client/Root';
import { AppContainer } from 'react-hot-loader';
import * as serviceWorker from './serviceWorker';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}
render(Root)

if (module.hot) {
  module.hot.accept('./client/Root', () => { render(Root) })
}
serviceWorker.unregister();