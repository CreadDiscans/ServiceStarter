import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Helmet, HelmetProvider } from "react-helmet-async";
import Header from 'layout/header';
import { Footer } from 'layout/footer';
import { connectWithoutDone, binding } from './core/connection';
import { RootState } from './Reducers';
import { Dispatch } from 'redux';
import { AuthAction } from 'auth/Auth.action';
import { tokenExpiredSubject } from './core/Api';
import { Alert } from 'component/Alert';
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

declare var firebase:any;
interface Props {
    AuthAction: typeof AuthAction
}

class App extends Component<Props> {

    componentDidMount() {
        const firebaseConfig = {
            apiKey: "AIzaSyCmfVBPAbeU76f-M1jpkMbOvuqJ1eF-dBE",
            authDomain: "servicestarter-770d0.firebaseapp.com",
            databaseURL: "https://servicestarter-770d0.firebaseio.com",
            projectId: "servicestarter-770d0",
            storageBucket: "servicestarter-770d0.appspot.com",
            messagingSenderId: "460789091763",
            appId: "1:460789091763:web:358e2a97967b45caff0fc6",
            measurementId: "G-4QT1LCRVJ0"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics()
        document.addEventListener('DOMContentLoaded', function(){
            if(navigator.serviceWorker){ 
            navigator.serviceWorker.register('/assets/sw.js') 
            .then(function(reg){
                console.log('서비스워커 등록성공 :', reg)
                const messaging = firebase.messaging();
                messaging.requestPermission().then(()=> {
                    console.log('권한 ok')
                    return messaging.getToken()
                }).then((token:any)=> console.log(token))
                .catch((err:any)=> console.log('권한 에러',err))
            }) 
            .catch(function(error){console.log('서비스워커 등록실패 :', error)}); 
            }
        })
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
                        <Route path="*" component={()=><Redirect to="/" />} />
                    </Switch>
                </div>
                <Footer />
                <Alert />
            </HelmetProvider>
        );
    }
}

export default connectWithoutDone(
    (state:RootState)=> ({}),
    (dispatch:Dispatch)=> ({
        AuthAction: binding(AuthAction, dispatch)
    }),
    App
)