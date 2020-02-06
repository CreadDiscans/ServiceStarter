import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { AuthState } from 'auth/Auth.action';
import { History } from 'history';
import { SessionChecker } from 'component/SesstionChecker';
import { Input, InputGroup, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { BoardState } from './Board.action';
import * as ApiType from 'types/api.types';
import { Api } from 'app/core/Api';

interface Props {
    auth:AuthState
    board:BoardState
    history:History
    location:Location
}

let CKEditor: any;
let ClassicEditor: any;
class BoardWrite extends React.Component<Props> {

    state:{
        item?:ApiType.BoardItem
        group?:ApiType.BoardGroup
        toggle:boolean
    } = {
        toggle:false
    }

    componentDidMount() {
        CKEditor = require('@ckeditor/ckeditor5-react')
        ClassicEditor = require('@ckeditor/ckeditor5-build-classic')
        const {auth, location, history, board} = this.props;
        const path = location.pathname.split('/')
        const id = path[path.length-1]
        Api.retrieve<ApiType.BoardItem>('/api-board/item/', id, {}).then(item=> {
            if (auth.userProfile && auth.userProfile.id !== item.author) {
                history.push('/board')
                return
            }
            this.setState({item, group:board.activeGroup})
        }).catch(err=>history.push('/board'))
    }

    async complete() {
        const {auth, history} = this.props;
        if (this.state.item && this.state.group && auth.userProfile) {
            Api.update<ApiType.BoardItem>('/api-board/item/', this.state.item.id, {
                title:this.state.item.title,
                content:this.state.item.content,
                group:this.state.group.id,
                author:auth.userProfile.id,
                author_name:auth.userProfile.name,
                valid:1
            }).then(res=> history.push('/board'))
        }
    }

    render() {
        const {auth, history, board} = this.props;
        return <div>
            <SessionChecker auth={auth} history={history} />
            <h3>Write</h3>
            <InputGroup>
                <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.toggle} toggle={()=>this.setState({toggle:!this.state.toggle})}>
                    <DropdownToggle color="secondary" caret outline>
                        {this.state.group && this.state.group.name}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Groups</DropdownItem>
                        {board.groups.map(item=> <DropdownItem onClick={()=>this.setState({group:item})} key={item.id}>{item.name}</DropdownItem>)}
                    </DropdownMenu>
                </InputGroupButtonDropdown>
                <Input placeholder="Title" value={this.state.item ? this.state.item.title: ''} 
                    onChange={(e)=>this.setState({item: {...this.state.item, title:e.target.value}})}/>
            </InputGroup>
            {CKEditor && <CKEditor 
                editor={ClassicEditor}
                config={{
                    ckfinder:{uploadUrl:'/upload/'}
                }}
                data={this.state.item ? this.state.item.content: ''}
                onChange={(event:any,editor:any)=> {
                    this.setState({item:{...this.state.item, content:editor.getData()}})
                }}
            />}
            <Button className="float-right" color="primary" onClick={()=>this.complete()}>Complete</Button>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth,
        board:state.board
    }),
    (dispatch:Dispatch)=>({}),
    BoardWrite
)