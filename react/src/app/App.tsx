import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, About, Users } from 'app/Routes';
import { Helmet } from "react-helmet";
import { Header } from 'layout/header';
import { Footer } from 'layout/footer';

class App extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>React Router & SSR</title>
                </Helmet>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/about/:name" component={About}/>
                    <Route path="/about" component={About}/>
                    <Route path="/users" component={Users}/>
                </Switch>
                <Footer />
            </div>
        );
    }
}

export default App;