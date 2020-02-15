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
import { translation } from 'component/I18next';
import { U } from 'app/core/U';
import { MediaQuery } from 'component/MediaQuery';
interface Props {
    auth:AuthState
    history:History
}

class Dashboard extends React.Component<Props> {

    t = translation('dashboard',[
        'dashboard',
        'shop',
        'chat',
        'task'
    ])

    render() {
        const {auth, history} = this.props;
        return <Container className="py-5 my-5">
            <SessionChecker auth={auth} history={history} />
            <Row>
                <Col xs={12} md={3}>
                    <ListGroup>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard')}>{this.t.dashboard}</a>
                        </ListGroupItem>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard/shop')}>{this.t.shop}</a>
                        </ListGroupItem>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard/chat')}>{this.t.chat}</a>
                        </ListGroupItem>
                        <ListGroupItem>
                            <a onClick={()=>history.push('/dashboard/task')}>{this.t.task}</a>
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
    t = translation('dashboardhome',[
        'dashboard'
    ])
    render() {
        return <div>
            <h3>{this.t.dashboard}</h3>
            <hr/>
            <h5>Auth</h5>
            <div>로그인, 회원가입, 메일인증, 비밀번호 초기화, SNS로그인(Google, Facebook, Naver, Kakao)</div>
            <hr/>
            <h5>Board</h5>
            <div>게시판 그룹 관리, 댓글, 대댓글, 이미지 업로더</div>
            <hr/>
            <h5>Shop</h5>
            <div>상품 등록/관리, 일반결제, 정기결제(이니시스 기준)</div>
            <hr/>
            <h5>Chat</h5>
            <div>채팅방 생성, 초대, 실시간 채팅, FCM 알림</div>
            <hr/>
            <h5>Task</h5>
            <div>Background 작업 등록, 실시간 작업 현황 확인</div>
            <hr />
            <h5>Common</h5>
            <div>반응형(Media Query), 국제화(i18n), Notification, Alert, Sesstion관리</div>
            <MediaQuery xs>xs</MediaQuery>
            <MediaQuery sm>sm</MediaQuery>
            <MediaQuery md>md</MediaQuery>
            <MediaQuery lg>lg</MediaQuery>
            <MediaQuery xl>xl</MediaQuery>
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