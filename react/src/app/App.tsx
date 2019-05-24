import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Home, About, Users, SingIn, SignUp } from 'app/Routes';
import { Helmet } from "react-helmet";
import { Header } from 'layout/header';
import { Footer } from 'layout/footer';
import * as authActions from 'auth/Auth.action';
import { bindActionCreators } from 'redux';
import { connectWithoutDone } from './core/connection';

class App extends Component<any> {
    
    componentDidMount() {
        const token = sessionStorage.getItem('token');
        if (token !== null) {
            const { AuthActions } = this.props;
            AuthActions.keep(token);
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

export default connectWithoutDone(
    (state:any)=> ({
      data: state.auth  
    }),
    (dispatch:any)=> ({
        AuthActions: bindActionCreators(authActions, dispatch)
    }),
    App
);