import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from 'app/App';
import store from 'app/Store';
import { Provider } from 'react-redux';

const Root = () => (
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>
);

export default Root;
