import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { AuthAction, authActions } from './Auth.action';
import { RootState } from 'app/Reducers';
import { connectWithoutDone } from 'app/core/connection';
import { Container, Form, Row, Col, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { History } from 'history';

interface Props {
  AuthAction: typeof AuthAction
  history: History
}

class SignIn extends React.Component<Props> {

  state = {
    username:'',
    password:'',
    invalid:{
      username:false,
      password:false,
      activate:false
    }
  }

  async submit(e:React.FormEvent<HTMLFormElement>) {
    e.stopPropagation()
    e.preventDefault()
    const res = await Api.list<{username:boolean, email:boolean}>('/api-user/',{
      username:this.state.username
    })
    if (!res.username) {
      this.setState({
        invalid:{
          password:false,
          username:true,
          activate:false
        }
      })
      return Promise.resolve()
    }
    const profile = await Api.list<ApiType.Profile[]>('/api-profile/', {
      user__username:this.state.username,
    })
    if (profile.length === 0) {
      this.setState({
        invalid:{
          password:false,
          username:true,
          activate:true
        }
      })
      return Promise.resolve()
    }
    const jwt = await Api.create<{token:string}>('/api/token-auth/', {
      username:this.state.username,
      password:this.state.password
    }).catch(err=>{
      this.setState({
        invalid:{
          password:true,
          username:false
        }
      })
    })
    if (jwt) {
      const { AuthAction } = this.props;
      AuthAction.signIn({
        token:jwt.token,
        profile: profile[0]
      })
      this.props.history.push('/')
    }
  }

  render() {
    return <Container className="my-5 py-5 d-flex justify-content-center">
    <Form className="w-100" style={{maxWidth:400}} onSubmit={(e)=>this.submit(e)}>
      <Row form>
        <Col>
          <h2>Sign In</h2>
          <FormGroup>
            <Label>Username</Label>
            <Input type="text" value={this.state.username} onChange={(e)=>this.setState({username:e.target.value})} 
              invalid={this.state.invalid.username} />
            {this.state.invalid.activate ? 
              <FormFeedback>The username is not activated. Check the email.</FormFeedback> :
              <FormFeedback>The username not existed.</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input type="password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} 
              invalid={this.state.invalid.password} />
            <FormFeedback>The password was not wrong</FormFeedback>
          </FormGroup>
          <div className="text-center">
            <Button className="mx-2" color="secondary" onClick={()=>this.props.history.push('/signup')} >Sign Up</Button>
            <Button className="mx-2" color="primary" >Sign In</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button className="btn-sm my-2" color="light" onClick={()=>this.props.history.push('/reset')}>forgot password</Button>
        </Col>
      </Row>
    </Form>
  </Container>
  }
}

export default connectWithoutDone(
    (state:RootState)=> ({}),
    (dispatch:Dispatch)=> ({
        AuthAction: bindActionCreators(authActions, dispatch)
    }),
    SignIn
)