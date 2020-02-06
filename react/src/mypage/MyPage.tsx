import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Row, Container, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { AuthState } from 'auth/Auth.action';
import { SessionChecker } from 'component/SesstionChecker';
import { History } from 'history';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { Switch, Route } from 'react-router-dom';
import MyProfile from './MyProfile';
import Payment from './Payment';
interface Props {
    auth:AuthState
    history:History
}

class MyPage extends React.Component<Props> {

    state = {
        username:'',
        email:'',
        last_login:'',
        date_joined:'',
        name:''
    }

    componentDidMount() {
        const {auth} = this.props;
        if (auth.userProfile) {
            Api.retrieve<ApiType.Profile>('/api-profile/', auth.userProfile.id, {
                depth:1
            }).then(res=> {
                if (typeof res.user == 'object' && auth.userProfile) {
                    this.setState({
                        username:res.user.username,
                        email:res.user.email,
                        last_login: new Date(res.user.last_login).toLocaleString(),
                        date_joined:new Date(res.user.date_joined).toLocaleString(),
                        name: auth.userProfile.name
                    })
                }
            })
        }
    }

    render() {
        const {auth, history} = this.props;
        return <Container className="py-5 my-5">
            <SessionChecker auth={auth} history={history}/>
            <Row>
                <Col xs={12} md={3}>
                    <ListGroup>
                        <ListGroupItem>
                            <a onClick={()=> history.push('/mypage')}>MyPage</a>
                        </ListGroupItem>
                        <ListGroupItem>
                            <a onClick={()=> history.push('/mypage/payment')}>Payment</a>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
                <Col xs={12} md={9}>
                    <Switch>
                        <Route exact path="/mypage" component={MyProfile} />
                        <Route exact path="/mypage/payment" component={Payment} />
                    </Switch>
                </Col>
            </Row>
        </Container>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({}),
    MyPage
)