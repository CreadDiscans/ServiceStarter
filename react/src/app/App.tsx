import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Helmet, HelmetProvider } from "react-helmet-async";
import Header from 'layout/header';
import { Footer } from 'layout/footer';
import { connectWithoutDone } from './core/connection';
import { RootState } from './Reducers';
import { Dispatch, bindActionCreators } from 'redux';
import { AuthAction, authActions } from 'auth/Auth.action';
import { tokenExpiredSubject } from './core/Api';
import { Alert } from 'component/Alert';
import { 
    Home, 
    SingIn, 
    SignUp, 
    Activation, 
    Reset,
    MyPage,
    Board
} from 'app/Routes';

interface Props {
    AuthAction: typeof AuthAction
}

class App extends Component<Props> {


    componentDidMount() {
        tokenExpiredSubject.subscribe(val=> {
            if(val) {
                const { AuthAction } = this.props;
                AuthAction.signOut();
            }
        })
    }
    
    render() {
        return (
            <HelmetProvider>
                <Helmet>
                    <title>React Router & SSR</title>
                </Helmet>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route eaxct path="/signin" component={SingIn}/>
                    <Route eaxct path="/signup" component={SignUp}/>
                    <Route eaxct path="/activation" component={Activation}/>
                    <Route path="/reset" component={Reset}/>
                    <Route exact path="/mypage" component={MyPage}/>
                    <Route path="/board" component={Board}/>
                    <Route path="*" component={()=><Redirect to="/" />} />
                </Switch>
                <Footer />
                <Alert />
            </HelmetProvider>
        );
    }
}

export default connectWithoutDone(
    (state:RootState)=> ({}),
    (dispatch:Dispatch)=> ({
        AuthAction: bindActionCreators(authActions, dispatch)
    }),
    App
)