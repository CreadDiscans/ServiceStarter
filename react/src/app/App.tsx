import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Home, About, Users, SingIn, SignUp } from 'app/Routes';
import { Helmet } from "react-helmet";
import { Header } from 'layout/header';
import { Footer } from 'layout/footer';
import { connection, Props } from './Reducers';

class App extends Component<Props> {
    
    componentWillMount() {
        this.props.done();
    }

    componentDidMount() {
        const token = sessionStorage.getItem('token');
        if (token) {
            const { AuthAction } = this.props;
            AuthAction.setToken(token);
        }
    }

    render() {
        return (
            <div>
                <Helmet>
                    <title>React Router & SSR</title>
                </Helmet>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route eaxct path="/about/:name" component={About}/>
                    <Route eaxct path="/about" component={About}/>
                    <Route eaxct path="/users" component={Users}/>
                    <Route eaxct path="/signin" component={SingIn}/>
                    <Route eaxct path="/signup" component={SignUp}/>
                    <Route path="*" component={()=><Redirect to="/" />} />
                </Switch>
                <Footer />
            </div>
        );
    }
}

export default connection(App)