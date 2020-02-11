import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Container, Col, Row, ListGroupItem, ListGroup } from 'reactstrap';
import { SessionChecker } from 'component/SesstionChecker';
import { AuthState } from 'auth/Auth.action';
import { History } from 'history';
import { Switch, Route } from 'react-router-dom';
import Shop from './Shop';
import Payment from './ShopDetail';
import Chat from './Chat';
import ChatRoom from './ChatRoom';
import Task from './Task';
interface Props {
    auth:AuthState
    history:History
}

class Dashboard extends React.Component<Props> {

    render() {
        const {auth, history} = this.props;
        return <Container className="py-5 my-5">
            <SessionChecker auth={auth} history={history} />
            <Row>
                <Col xs={12} md={3}>
                    <ListGroup>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard')}>Dashboard</a>
                        </ListGroupItem>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard/shop')}>Shop</a>
                        </ListGroupItem>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard/chat')}>Chat</a>
                        </ListGroupItem>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard/task')}>Task</a>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col xs={12} md={9}>
                    <Switch>
                        <Route exact path="/dashboard" component={DashboardHome}/>
                        <Route exact path="/dashboard/shop" component={Shop}/>
                        <Route exact path="/dashboard/shop/:id" component={Payment}/>
                        <Route exact path="/dashboard/chat" component={Chat}/>
                        <Route exact path="/dashboard/chat/:id" component={ChatRoom}/>
                        <Route exact path="/dashboard/task" component={Task}/>
                    </Switch>
                </Col>
            </Row>
        </Container>
    }
}

class DashboardHome extends React.Component {
    render() {
        return <div>
            <h3>Dashboard</h3>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth: state.auth
    }),
    (dispatch:Dispatch)=>({}),
    Dashboard
)