import React from 'react';
import { Button } from 'reactstrap';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import firebase from 'firebase/app';
import "firebase/auth";
import { AuthAction } from './Auth.action';
import { History } from 'history';

const fbConfig = {
    apiKey: "AIzaSyCmfVBPAbeU76f-M1jpkMbOvuqJ1eF-dBE",
    authDomain: "servicestarter-770d0.firebaseapp.com",
    projectId: "servicestarter-770d0",
}

firebase.initializeApp(fbConfig)
const googleProvider = new firebase.auth.GoogleAuthProvider()

interface Props {
    AuthAction: typeof AuthAction
    history: History
}

class SocialLogin extends React.Component<Props> {

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

    }

    kakaoLogin() {

    }

    naverLogin() {

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