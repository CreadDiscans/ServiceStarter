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
interface Props {
    location:Location
}

class ChatRoom extends React.Component<Props> {

    state:{
        profiles:ApiType.Profile[]
        profileCurrentPage:number
        profileTotalPage:number
        room?:ApiType.ChatRoom
        input:string
    } = {
        profiles:[],
        profileCurrentPage:1,
        profileTotalPage:1,
        input:''
    }

    componentDidMount() {
        this.loadProfile(1)
        this.loadRoom()
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
            }).then(()=> this.loadRoom())
        }
    }

    submit(e:React.FormEvent<HTMLFormElement>) {
        e.stopPropagation()
        e.preventDefault()
    }

    render() {
        return <div>
            <h3>ChatRoom</h3>
            <Row>
                <Col md={6}>
                    <h4>사용자</h4>
                    <ListGroup>
                        {this.state.profiles.map(profile=><ListGroupItem key={profile.id}>
                            {profile.name}
                            {this.state.room && (this.state.room.user as ApiType.Profile[])
                                .filter(u=>u.id === profile.id).length === 0 && 
                                <Button className="btn-sm float-right" onClick={()=>this.invite(profile)}>초대</Button>}
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
                    <h4>메시지</h4>
                    <div className="border border-bottom-0 rounded-top p-3" 
                        style={{minHeight:300, overflow:'auto'}}>

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
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    ChatRoom
)