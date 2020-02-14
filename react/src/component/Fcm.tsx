import React from 'react';
import { connectWithoutDone, binding } from '../app/core/connection';
import { RootState } from '../app/Reducers';
import { Dispatch } from 'redux';
import { AuthState, AuthAction } from 'auth/Auth.action';
import { SharedAction } from './Shared.action';
import { History } from 'history';
import { DashboardAction } from 'dashboard/Dashboard.action';
declare var firebase:any;

interface Props {
    auth:AuthState
    AuthAct:typeof AuthAction
    SharedAct:typeof SharedAction
    DashboarcAct:typeof DashboardAction
    history:History
    location:Location
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
                const { SharedAct, history, DashboarcAct, location, auth } = this.props
                if(data.type === 'message') {
                    SharedAct.notify({
                        content:'메시지가 도착했습니다.',
                        onClick:()=>history.push('/dashboard/chat/'+data.room)
                    })
                } else if (data.type === 'room') {
                    if (location.pathname === '/dashboard/chat') {
                        auth.userProfile && DashboarcAct.loadChatRoom(auth.userProfile)
                    }
                    SharedAct.notify({
                        content:'새로운 채팅방에 초대되었습니다.',
                        onClick:()=>history.push('/dashboard/chat') 
                    })
                }
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
        AuthAct:binding(AuthAction, dispatch),
        SharedAct:binding(SharedAction, dispatch),
        DashboarcAct:binding(DashboardAction, dispatch)
    }),
    Fcm
)