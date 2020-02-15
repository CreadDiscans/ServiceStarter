import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Helmet, HelmetProvider } from "react-helmet-async";
import Header from 'layout/header';
import { Footer } from 'layout/footer';
import { connectWithoutDone, binding } from './core/connection';
import { RootState } from './Reducers';
import { Dispatch } from 'redux';
import { AuthAction } from 'auth/Auth.action';
import Alert from 'component/Alert';
import Notification from 'component/Notification';
import { 
    Home, 
    SingIn, 
    SignUp, 
    Activation, 
    Reset,
    MyPage,
    Board,
    Dashboard
} from 'app/Routes';
import { NaverAuthCallbackComponent } from 'auth/SocialLogin';
import Fcm from '../component/Fcm';
import { I18next } from 'component/I18next';
interface Props {
    AuthAct: typeof AuthAction
}

class App extends Component<Props> {
    
    render() {
        return (
            <HelmetProvider>
                <Helmet>
                    <title>React Router & SSR</title>
                </Helmet>
                <I18next/>
                <Header />
                <div style={{flex:1}}>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route eaxct path="/signin" component={SingIn}/>
                        <Route eaxct path="/signup" component={SignUp}/>
                        <Route eaxct path="/activation" component={Activation}/>
                        <Route eaxct path="/naver" component={NaverAuthCallbackComponent}/>
                        <Route  path="/dashboard" component={Dashboard} />
                        <Route path="/reset" component={Reset}/>
                        <Route path="/mypage" component={MyPage}/>
                        <Route path="/board" component={Board}/>
                        <Route path="/firebase-cloud-messaging-push-scope" component={Home} />
                        <Route path="*" component={()=><Redirect to="/" />} />
                    </Switch>
                </div>
                <Footer />
                <Alert />
                <Fcm />
                <Notification />
            </HelmetProvider>
        );
    }
}

export default connectWithoutDone(
    (state:RootState)=> ({}),
    (dispatch:Dispatch)=> ({
        AuthAct: binding(AuthAction, dispatch)
    }),
    App
)