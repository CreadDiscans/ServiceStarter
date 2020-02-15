import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { AuthState } from 'auth/Auth.action';
import { History } from 'history';
import { DashboardAction, DashboardState } from './Dashboard.action';
import { translation } from 'component/I18next';
interface Props {
    auth:AuthState
    dashboard:DashboardState
    DashboardAct:typeof DashboardAction
    history:History
}

class Chat extends React.Component<Props> {

    t = translation('chat', [
        "chat",
        "leave",
        "createroom"
    ])

    componentDidMount() {
        this.loadChatRoom()
    }

    async loadChatRoom() {
        const {auth, DashboardAct} = this.props;
        if (auth.userProfile) {
            DashboardAct.loadChatRoom(auth.userProfile)
        }
    }

    createRoom() {
        const {auth} = this.props;
        if (auth.userProfile) {
            Api.create<ApiType.ChatRoom>('/api-chat/room/', {
                'user':[auth.userProfile.id]
            }).then(res=> {
                this.loadChatRoom()
            })
        }
    }

    getRoomName(room:ApiType.ChatRoom) {
        return (room.user as ApiType.Profile[]).map(user=>user.name).join(',')
    }

    exitRoom(item:ApiType.ChatRoom) {
        const { auth, DashboardAct } = this.props
        if (auth.userProfile) {
            DashboardAct.exitChatRoom(auth.userProfile, item)
        }
    }

    render() {
        const { history, dashboard } = this.props
        return <div>
            <h3>{this.t.chat}</h3>
            <ListGroup className="mb-3">
                {dashboard.chatRooms.map(room=><ListGroupItem key={room.id} 
                    style={{cursor:'pointer'}}
                    onClick={()=>history.push('/dashboard/chat/'+room.id)}>
                    {this.getRoomName(room)}
                    <Button className="btn-sm float-right" color="danger" 
                    onClick={(e)=>{e.stopPropagation(); this.exitRoom(room)}}>{this.t.leave}</Button>
                </ListGroupItem>)}
            </ListGroup>
            <Button color="primary" onClick={()=>this.createRoom()}>{this.t.createroom}</Button>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth,
        dashboard:state.dashboard
    }),
    (dispatch:Dispatch)=>({
        DashboardAct:binding(DashboardAction, dispatch)
    }),
    Chat
)