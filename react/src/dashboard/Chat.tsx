import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { AuthState } from 'auth/Auth.action';
import { U } from 'app/core/U';
import { History } from 'history';
interface Props {
    auth:AuthState
    history:History
}

class Chat extends React.Component<Props> {

    state:{
        rooms:ApiType.ChatRoom[]
    } = {
        rooms:[]
    }

    componentDidMount() {
        this.loadChatRoom()
    }

    async loadChatRoom() {
        const {auth} = this.props;
        if (auth.userProfile) {
            const rooms = await Api.list<ApiType.ChatRoom[]>('/api-chat/room/',{
                'user':auth.userProfile.id,
            })
            const profiles = await Api.list<ApiType.Profile[]>('/api-profile/',{
                'pk__in[]':U.union(rooms.map(room=>room.user))
            })
            rooms.forEach(room=>{
                room.user = (room.user as number[]).map(user=> profiles.filter(p=>p.id === user)[0])
            })
            this.setState({rooms:rooms})
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

    render() {
        const { history } = this.props
        return <div>
            <h3>Chat</h3>
            <ListGroup className="mb-3">
                {this.state.rooms.map(room=><ListGroupItem key={room.id} 
                    style={{cursor:'pointer'}}
                    onClick={()=>history.push('/dashboard/chat/'+room.id)}>
                    {this.getRoomName(room)}
                </ListGroupItem>)}
            </ListGroup>
            <Button color="primary" onClick={()=>this.createRoom()}>방 만들기</Button>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({}),
    Chat
)