import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import * as A from 'app';
import { Helmet } from "react-helmet";


class App extends Component {

    render() {
        return (
            <div>
                <Helmet>
                    <title>React Router &amp; SSR</title>
                </Helmet>
                {
                    process.env.NODE_ENV === 'development' ? 
                    (<Switch>
                        <Route path="/data-test" component={A.DataTest}/>
                        <Route path="/theme-test" component={A.ThemeTest}/>
                        <Route path="/" component={A.Main}/>
                    </Switch>) : 
                    <Route path="/" component={A.Main}/>
                }
            </div>
        );
    }
}

export default App;