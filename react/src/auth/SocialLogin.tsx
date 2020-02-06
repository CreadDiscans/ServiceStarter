import React from 'react';
import { Button } from 'reactstrap';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import firebase from 'firebase/app';
import "firebase/auth";
import { AuthAction } from './Auth.action';
import { History } from 'history';

declare var window:any;
declare var naver:any;
declare var Kakao:any;

const fbConfig = {
    apiKey: "AIzaSyCmfVBPAbeU76f-M1jpkMbOvuqJ1eF-dBE",
    authDomain: "servicestarter-770d0.firebaseapp.com",
    projectId: "servicestarter-770d0",
}
const naverConfig = {
    clientId: "GfwH3vvqAGsA6nx8zX_X",
    callbackUrl: "http://localhost:8000/naver",
    isPopup: true,
    loginButton: {color: "green", type: 3, height: 60}
}

firebase.initializeApp(fbConfig)
const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()
interface Props {
    AuthAction: typeof AuthAction
    history: History
}

class SocialLogin extends React.Component<Props> {
    naverProvider:any
    componentDidMount() {
        this.naverProvider = new naver.LoginWithNaverId(naverConfig)
        this.naverProvider.init();
    }

    googleLogin() {
        firebase.auth().signInWithPopup(googleProvider).then((result:any)=> {
            const {AuthAction, history} = this.props;
            const token = result.credential.accessToken
            const user = result.user
            AuthAction.socialSign(
                'google',
                user.uid,
                user.displayName,
                token
            ).then(()=>history.push('/'))
        })
    }

    facebookLogin() {
        firebase.auth().signInWithPopup(facebookProvider).then((result:any)=>{
            const {AuthAction, history} = this.props;
            const token = result.credential.accessToken
            const user = result.user
            AuthAction.socialSign(
                'facebook',
                user.uid,
                user.displayName,
                token
            ).then(()=>history.push('/'))
        })
    }

    kakaoLogin() {

    }

    naverLogin() {
        window.addEventListener('message', (e:MessageEvent)=> {
            if (e.data.type == 'naver_login') {
                const {AuthAction, history} = this.props;
                AuthAction.socialSign(
                    'naver',
                    e.data.user.id,
                    e.data.user.name ? e.data.user.name : 'noname',
                    e.data.access_token.accessToken
                ).then(()=>history.push('/'))
            }
        })
        const elem:any = document.getElementById('naverIdLogin_loginButton')
        elem.click()
    }

    render() {
        return <div style={{maxWidth:500, margin:'auto'}}>
            <div>
                <Button className="m-1 w-25" onClick={()=>this.googleLogin()} color="danger">Google</Button>
                <Button className="m-1 w-25" onClick={()=>this.facebookLogin()} color="info">Facebook</Button>
            </div>
            <div>
                <Button className="m-1 w-25" onClick={()=>this.naverLogin()} color="success">Naver</Button>
                <Button className="m-1 w-25" onClick={()=>this.kakaoLogin()} color="warning">Kakao</Button>
            </div>
            <div id="naverIdLogin" style={{display:'none'}}></div>
            <div id="kakao-login-btn" style={{display:'none'}}></div>
        </div>
    }
}
export class NaverAuthCallbackComponent extends React.Component {

    componentDidMount() {
        const naverProvider = new naver.LoginWithNaverId(naverConfig)
        naverProvider.init();
        naverProvider.getLoginStatus((status:any)=> {
            if(status) {
                window.opener.postMessage({
                    'type': 'naver_login',
                    'state': true,
                    'user': naverProvider.user,
                    'access_token': naverProvider.accessToken
                })
            } else {
                window.opener.postMessage({
                    'type': 'naver_login',
                    'state': false
                })
            }
            window.close();
        })
    }

    render() {
        return <div>
            <div id="naverIdLogin" style={{display:'none'}}></div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({
        AuthAction: binding(AuthAction, dispatch)
    }),
    SocialLogin
)