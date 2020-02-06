import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Row, Container, Col } from 'reactstrap';
import { AuthState } from 'auth/Auth.action';
import { SessionChecker } from 'component/SesstionChecker';
import { History } from 'history';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
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
            <h3>My Page</h3>
            <div className="py-2">
                {[
                    {key:'Username', val:this.state.username},
                    {key:'Email', val:this.state.email},
                    {key:'Last Login', val:this.state.last_login},
                    {key:'Joined', val:this.state.date_joined},
                    {key:'Name', val:this.state.name}
                ].map((item, i)=> <div className="d-flex flex-row m-2" key={i}>
                    <div className="w-25 font-weight-bold">{item.key}</div>
                    <div>{item.val}</div>
                </div>)}
            </div>
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