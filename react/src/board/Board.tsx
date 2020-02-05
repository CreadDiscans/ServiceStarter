import React from 'react';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { connectWithDone, binding } from 'app/core/connection';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { BoardAction, BoardState } from './Board.action';
import * as ApiType from 'types/api.types';
import BoardList from './BoardList';
import { Switch, Route } from 'react-router-dom';
import BoardWrite from './BoardWrite';
import { History } from 'history';

interface Props {
    board:BoardState
    BoardAction: typeof BoardAction
    done:any
    history: History
}

class Board extends React.Component<Props> {

    UNSAFE_componentWillMount() {
        const {done, BoardAction} = this.props;
        BoardAction.boardGroup().then((res)=> {
            if (res.activeGroup) {
                BoardAction.boardList(1, res.activeGroup).then(done, done)
            } else {
                done(res)
            }
        }, done)
    }

    selectGroup(group:ApiType.BoardGroup) {
        const {BoardAction, history} = this.props;
        BoardAction.boardList(1, group)
        history.push('/board')
    }

    render() {
        const {board} = this.props;
        return <Container className="my-5 py-5">
            <h3>Board</h3>
            <Row>
                <Col xs={12} md={3}>
                    <ListGroup>
                        {board.groups.map(item=><ListGroupItem key={item.id}>
                            <a onClick={()=> this.selectGroup(item)}>{item.name}</a>
                        </ListGroupItem>)}
                    </ListGroup>
                </Col>
                <Col xs={12} md={9}>
                    <Switch>
                        <Route exact path="/board" component={BoardList}/>
                        <Route exact path="/board/write" component={BoardWrite}/>
                    </Switch>
                </Col>
            </Row>
        </Container>
    }
}

export default connectWithDone(
    (state:RootState)=>({
        board:state.board
    }),
    (dispatch:Dispatch)=>({
        BoardAction:binding(BoardAction, dispatch)
    }),
    Board
)