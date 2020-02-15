import React from 'react';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { binding, connectWithoutDone } from 'app/core/connection';
import { BoardState, BoardAction } from './Board.action';
import { Paginator } from 'component/Paginator';
import { Button, Table } from 'reactstrap';
import { AuthState } from 'auth/Auth.action';
import { History } from 'history';
import moment from 'moment';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { translation } from 'component/I18next';
interface Props {
    auth:AuthState
    board:BoardState
    BoardAction:typeof BoardAction
    done:any
    history:History
}

class BoardList extends React.Component<Props> {

    t = translation('boardlist',[
        'title',
        'author',
        'created',
        'write'
    ])

    componentDidMount() {
        const {board, BoardAction} = this.props;
        if (board.activeGroup) {
            BoardAction.boardList(1, board.activeGroup)
        }
    }

    changePage(page:number) {
        const {BoardAction, board} = this.props;
        if (board.activeGroup) {
            BoardAction.boardList(page, board.activeGroup)
        }
    }

    write() {
        const { board, auth, history } = this.props;
        if (board.activeGroup && auth.userProfile) {
            Api.create<ApiType.BoardItem>('/api-board/item/', {
                title:'',
                content:'',
                group:board.activeGroup.id,
                author:auth.userProfile.id,
            }).then(res=> history.push('/board/write/'+res.id))
        }
    }

    render() {
        const {auth, board, history} = this.props;
        return <div>
            <h3>{board.activeGroup && board.activeGroup.name}</h3>
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{this.t.title}</th>
                        <th>{this.t.author}</th>
                        <th>{this.t.created}</th>
                    </tr>
                </thead>
                <tbody>
                    {board.list.map(item=> <tr key={item.id}>
                        <th scope="row"><a onClick={()=>history.push('/board/'+item.id)}>{item.id}</a></th>
                        <td><a onClick={()=>history.push('/board/'+item.id)}>{item.title}</a></td>
                        <td><a onClick={()=>history.push('/board/'+item.id)}>{typeof item.author !=='number' && item.author.name}</a></td>
                        <td><a onClick={()=>history.push('/board/'+item.id)}>{moment(item.created).fromNow()}</a></td>
                    </tr>)}
                </tbody>
            </Table>
            {auth.userProfile && <Button color="primary" className="float-right" onClick={()=>this.write()}>{this.t.write}</Button>}
            <Paginator 
                currentPage={board.currentPage}
                totalPage={board.totalPage}
                onSelect={(page:number)=>this.changePage(page)}/>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth,
        board:state.board
    }),
    (dispatch:Dispatch)=>({
        BoardAction:binding(BoardAction, dispatch)
    }),
    BoardList
)