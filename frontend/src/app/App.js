import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Header, Footer } from 'app';
import { Helmet } from "react-helmet";

class App extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>React Router & SSR</title>
                </Helmet>
                <Route path="/" component={Header}/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                </Switch>
                <Route path="/" component={Footer}/>
            </div>
        );
    }
}

export default App;