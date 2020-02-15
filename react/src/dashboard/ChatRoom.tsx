import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Api } from 'app/core/Api';
import { U } from 'app/core/U';
import { Col, Row, ListGroup, ListGroupItem, Button, InputGroup, Input, InputGroupAddon, Form } from 'reactstrap';
import * as ApiType from 'types/api.types';
import { Paginator } from 'component/Paginator';
import { FaPaperPlane } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/ko'
import { AuthState } from 'auth/Auth.action';
import { translation, getLang } from 'component/I18next';
moment.locale(getLang())
interface Props {
    auth:AuthState
    location:Location
}

class ChatRoom extends React.Component<Props> {

    t = translation('chatroom',[
        "chatroom",
        "user",
        "invite",
        "message",
        "chatroominvitaion",
        "invitechatroom"
    ])
    socket!:WebSocket
    chat:any
    scrollUpdate = false
    whenScrollUpHeight = 0

    state:{
        profiles:ApiType.Profile[]
        profileCurrentPage:number
        profileTotalPage:number
        room?:ApiType.ChatRoom
        input:string
        messages:ApiType.ChatMessage[]
        messageCurrentPage:number
        messageTotalPage:number
    } = {
        profiles:[],
        profileCurrentPage:1,
        profileTotalPage:1,
        input:'',
        messages:[],
        messageCurrentPage:1,
        messageTotalPage:1
    }

    componentDidMount() {
        this.loadProfile(1)
        this.loadRoom()
        this.loadMessage(1)
        this.connectWebSocket()
    }

    componentWillUnmount() {
        this.socket.close()
    }

    getSnapshotBeforeUpdate(prevProps:Props,prevState:any){
        if (this.state.messages.length !== prevState.messages.length) {
            this.scrollUpdate = true
        }
        return null
    }

    componentDidUpdate() {
        if (this.scrollUpdate) {
            if (this.whenScrollUpHeight !== 0) {
                this.chat.scrollTop = this.chat.scrollHeight - this.whenScrollUpHeight
                this.whenScrollUpHeight = 0
            } else {
                this.chat.scrollTop = this.chat.scrollHeight
            }
            this.scrollUpdate = false
        }
    }

    connectWebSocket() {
        const {location} = this.props;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        this.socket = new WebSocket(protocol + '//' + window.location.host + '/ws/message/'+U.getId(location)+'/');
        this.socket.onopen = (ev) => {
            console.log(ev)
        }
        this.socket.onclose = (ev) => {
            console.log(ev)
        }
        this.socket.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            this.setState({messages:[...this.state.messages, data]})
        }
        this.socket.onerror = (err) => {
            console.log(err)
        }
    }

    async loadMessage(page:number) {
        const {location} = this.props;
        const res = await Api.list<{total_page:number,items:ApiType.ChatMessage[]}>('/api-chat/message/',{
            page:page,
            count_per_page:10,
            room:U.getId(location)
        })
        const profiles = await Api.list<ApiType.Profile[]>('/api-profile/',{
            'pk__in[]':U.union(res.items.map(item=>[item.sender]))
        })
        res.items.forEach(item=> item.sender = profiles.filter(p=>p.id === item.sender)[0])
        res.items.reverse()
        this.setState({messages:[...res.items, ...this.state.messages], messageCurrentPage:page, messageTotalPage:res.total_page})
    }

    async loadRoom() {
        const { location } = this.props;
        const room = await Api.retrieve<ApiType.ChatRoom>('/api-chat/room/',U.getId(location),{})
        room.user = await Api.list<ApiType.Profile[]>('/api-profile/',{
            'pk__in[]':room.user
        })
        this.setState({room})
    }

    async loadProfile(page:number) {
        const res = await Api.list<{total_page:number,items:ApiType.Profile[]}>('/api-profile/',{
            page:page,
            count_per_page:10
        })
        this.setState({
            profiles:res.items,
            profileCurrentPage:page,
            profileTotalPage:res.total_page
        })
    }

    invite(profile:ApiType.Profile) {
        if (this.state.room) {
            Api.patch('/api-chat/room/', this.state.room.id, {
                user:(this.state.room.user as ApiType.Profile[]).map(u=>u.id).concat([profile.id])
            }).then(()=> {
                Api.create('/sendfcm/',{
                    token:profile.id,
                    notification: {
                        title:this.t.chatroominvitaion,
                        body:this.t.invitechatroom,
                        icon:'/assets/logo.png',
                        click_action:'/dashboard/chat'
                    },
                    data:{
                        type:'room',
                    }
                })
                this.loadRoom()
            })
        }
    }

    submit(e:React.FormEvent<HTMLFormElement>) {
        e.stopPropagation()
        e.preventDefault()
        if(this.state.input) {
            const {location, auth} = this.props;
            if (auth.userProfile) {
                this.socket.send(JSON.stringify({
                    content:this.state.input,
                    room: U.getId(location),
                    created: moment().format('YYYY-MM-DD[T]HH:mm:ss'),
                    sender:auth.userProfile.id
                }))
                this.setState({input:''})
            }
        }
    }

    onScroll(e:any) {
        if (e.target.scrollTop === 0 && this.state.messageCurrentPage < this.state.messageTotalPage) {
            this.whenScrollUpHeight = this.chat.scrollHeight
            this.loadMessage(this.state.messageCurrentPage+1)
        }
    }

    render() {
        const {auth} = this.props;
        return <div>
            <h3>{this.t.chatroom}</h3>
            <Row>
                <Col md={6}>
                    <h4>{this.t.user}</h4>
                    <ListGroup>
                        {this.state.profiles.map(profile=><ListGroupItem key={profile.id}>
                            {profile.name}
                            {this.state.room && (this.state.room.user as ApiType.Profile[])
                                .filter(u=>u.id === profile.id).length === 0 && 
                                <Button className="btn-sm float-right" onClick={()=>this.invite(profile)}>{this.t.invite}</Button>}
                        </ListGroupItem>)}
                    </ListGroup>
                    <div className="my-3 d-flex justify-content-center">
                        <Paginator 
                            currentPage={this.state.profileCurrentPage}
                            totalPage={this.state.profileTotalPage}
                            onSelect={(page:number)=>this.loadProfile(page)}
                        />
                    </div>
                </Col>
                <Col md={6}>
                    <h4>{this.t.message}</h4>
                    <div ref={ref=>this.chat=ref}className="border border-bottom-0 rounded-top p-3" 
                        style={{height:300, overflow:'auto', scrollBehavior:this.whenScrollUpHeight === 0 ? 'smooth':'unset'}}
                        onScroll={(e)=>this.onScroll(e)}>
                        {this.state.messages.map((item, i)=> <div className="mb-2" key={i}>
                            {auth.userProfile && typeof item.sender !== 'number' && auth.userProfile.id !== item.sender.id && 
                            <div style={{fontSize:12, fontWeight:'bold'}}>{item.sender.name}</div>}
                            <div className="border rounded-lg p-1 w-75" style={Object.assign({fontSize:12},auth.userProfile && typeof item.sender !== 'number' &&
                                auth.userProfile.id === item.sender.id ? {
                                    marginLeft:'25%',
                                    background:'#fbffbd',
                                    textAlign:'right'
                                }:{})}>
                                {item.content}
                            </div>
                            <div style={Object.assign({fontSize:10},auth.userProfile && typeof item.sender !== 'number' &&
                                auth.userProfile.id === item.sender.id ? {
                                    textAlign:'right'
                                }:{})}>{moment(item.created).fromNow()}</div>
                        </div>)}
                    </div>
                    <Form onSubmit={(e)=>this.submit(e)}>
                        <InputGroup>
                            <Input value={this.state.input} onChange={(e)=>this.setState({input:e.target.value})} className="rounded-0" />
                            <InputGroupAddon addonType="append">
                                <Button className="rounded-0">
                                    <FaPaperPlane />
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Form>
                </Col>
            </Row>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({}),
    ChatRoom
)