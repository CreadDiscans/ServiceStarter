import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from '../App';

const render = (location:any) => ReactDOMServer.renderToString(
  <StaticRouter location={location}>
    <App />
  </StaticRouter>
)

export default render;