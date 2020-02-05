import React from 'react';
import ReactDOM from 'react-dom';
import Root from './ClientRoot';
import { register } from './serviceWorker';
import { AppContainer } from 'react-hot-loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './agency.min.css';
import './index.css';
declare var module:any;

const render = (Component:any) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Root)


if (module.hot) {
  module.hot.accept('./ClientRoot', () => { render(Root) })
}


register();