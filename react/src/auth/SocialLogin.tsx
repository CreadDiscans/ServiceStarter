import React from 'react';
import { Button } from 'reactstrap';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import firebase from 'firebase/app';
import "firebase/auth";

const fbConfig = {
    apiKey: "AIzaSyCmfVBPAbeU76f-M1jpkMbOvuqJ1eF-dBE",
    authDomain: "servicestarter-770d0.firebaseapp.com",
    projectId: "servicestarter-770d0",
}

firebase.initializeApp(fbConfig)
const googleProvider = new firebase.auth.GoogleAuthProvider()

class SocialLogin extends React.Component {

    googleLogin() {
        firebase.auth().signInWithPopup(googleProvider).then((result:any)=> {
            const token = result.credential.accessToken
            const user = result.user
            console.log(user, token)
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
    (dispatch:Dispatch)=>({}),
    SocialLogin
)