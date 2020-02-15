import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { History } from 'history';
import { AuthState } from 'auth/Auth.action';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { translation } from 'component/I18next';
import { Col, Row, Button } from 'reactstrap';

interface Props {
    auth:AuthState
    history:History
}

class MyProfile extends React.Component<Props> {

    t = translation('myprofile',[
        "mypage",
        "name",
        "lastlogin",
        "joined",
        "change"
    ])

    state = {
        last_login:'',
        date_joined:'',
        name:'',
        profile_img:''
    }

    fileInput:any

    componentDidMount() {
        const {auth} = this.props;
        if (auth.userProfile) {
            Api.retrieve<ApiType.Profile>('/api-profile/', auth.userProfile.id, {
                depth:1
            }).then(res=> {
                if (typeof res.user == 'object' && auth.userProfile) {
                    this.setState({
                        last_login: new Date(res.user.last_login).toLocaleString(),
                        date_joined:new Date(res.user.date_joined).toLocaleString(),
                        name: auth.userProfile.name,
                        profile_img:auth.userProfile.profile_img
                    })
                }
            })
        }
    }

    changeImage() {
        this.fileInput.onchange = async (e:any)=> {
            const {auth} = this.props
            const res = await Api.upload(e.target.files[0])
            if (res.uploaded && auth.userProfile) {
                const profile = await Api.patch<ApiType.Profile>('/api-profile/', auth.userProfile.id, {
                    profile_img:res.url
                })
                this.setState({profile_img:profile.profile_img})
            }
            this.fileInput.value = ''
        }
        this.fileInput.click()
    }

    render() {
        return <div>
            <h3>{this.t.mypage}</h3>
            <Row>
                <Col xs={12} md={3} className="text-center">
                    <div className="mb-3" style={{maxWidth:100}}><img src={this.state.profile_img ? this.state.profile_img : '/assets/default_profile.png'} /></div>
                    <Button color="primary" onClick={()=>this.changeImage()}>{this.t.change}</Button>
                </Col>
                <Col xs={12} md={9}>
                    <div className="py-2">
                        {[
                            {key:this.t.name, val:this.state.name},
                            {key:this.t.lastlogin, val:this.state.last_login},
                            {key:this.t.joined, val:this.state.date_joined}
                        ].map((item, i)=> <div className="d-flex flex-row m-2" key={i}>
                            <div className="w-25 font-weight-bold">{item.key}</div>
                            <div>{item.val}</div>
                        </div>)}
                    </div>
                </Col>
            </Row>
            <input type="file" ref={ref=>this.fileInput=ref} style={{display:'none'}}/>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({}),
    MyProfile
)