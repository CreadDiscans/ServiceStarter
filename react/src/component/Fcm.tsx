import React from 'react';
import { connectWithoutDone, binding } from '../app/core/connection';
import { RootState } from '../app/Reducers';
import { Dispatch } from 'redux';
import { AuthState, AuthAction } from 'auth/Auth.action';

declare var firebase:any;

interface Props {
    auth:AuthState
    AuthAct:typeof AuthAction
}

class Fcm extends React.Component<Props> {

    componentDidMount() {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then(res=> {
            const messaging = firebase.messaging()
            this.updateFcmToken(messaging)
            messaging.onTokenRefresh(()=> this.updateFcmToken(messaging))
            messaging.onMessage((payload:any)=> {
                const data = payload.data
                console.log(data)
            })
        }).catch(err=> console.log('err'))
        firebase.analytics()
    }

    updateFcmToken(messaging:any) {
        messaging.getToken().then((token:any)=>{
            const {auth, AuthAct} = this.props
            AuthAct.setFcm(auth.userProfile, token)
        })
    }

    render() {
        return <div></div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    }),
    Fcm
)