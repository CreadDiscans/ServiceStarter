import React from 'react';
import { StaticRouter } from 'react-router';
import App from 'app/App';

import { renderToString } from 'react-router-server';

import { Helmet } from 'react-helmet';

const render = async (location) => {

    const { html } = await renderToString(
        <StaticRouter location={location}>
            <App/>
        </StaticRouter>
    );

    const helmet = Helmet.renderStatic();

    return {
        html,
        state: store.getState(),
        helmet
    };
}

export default render;