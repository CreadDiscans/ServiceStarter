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
import * as CustomType from 'types/custom.types';
import { Api } from 'app/core/Api';

interface Props {
    auth:AuthState
    board:BoardState
    history:History
}

let CKEditor: any;
let ClassicEditor: any;
class BoardWrite extends React.Component<Props> {

    state:{
        group?:ApiType.BoardGroup
        title:string
        content:string
        toggle:boolean
    } = {
        group:undefined,
        title:'',
        content:'',
        toggle:false
    }

    componentDidMount() {
        CKEditor = require('@ckeditor/ckeditor5-react')
        ClassicEditor = require('@ckeditor/ckeditor5-build-classic')
        const {board} = this.props;
        this.setState({group:board.activeGroup})
    }

    async complete() {
        const {auth, history} = this.props;
        if (this.state.group && auth.userProfile && typeof(auth.userProfile.user)==='number') {
            const user = await Api.retrieve<CustomType.auth.User>('/api-user/',auth.userProfile.user, {})
            Api.create<ApiType.BoardItem>('/api-board/item/', {
                title:this.state.title,
                content:this.state.content,
                group:this.state.group.id,
                author:auth.userProfile.id,
                author_name:user.username
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
                <Input placeholder="Title" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})}/>
            </InputGroup>
            {CKEditor && <CKEditor 
                editor={ClassicEditor}
                config={{
                    ckfinder:{uploadUrl:'/upload/'}
                }}
                data={this.state.content}
                onChange={(event:any,editor:any)=> this.setState({content:editor.getData()})}
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