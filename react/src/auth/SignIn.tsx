import React from 'react';
import { Dispatch } from 'redux';
import { AuthAction, AuthState } from './Auth.action';
import { RootState } from 'app/Reducers';
import { connectWithoutDone, binding } from 'app/core/connection';
import { Container, Form, Row, Col, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { History } from 'history';
import SocialLogin from 'auth/SocialLogin';

interface Props {
  auth:AuthState
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
    const { AuthAction, auth } = this.props;
    AuthAction.signIn(this.state.username, this.state.password, auth.fcmToken)
    .then(res=> this.props.history.push('/'))
    .catch(err=> {
      if (err === 'no user') {
        this.setState({
          invalid:{
            password:false,
            username:true,
            activate:false
          }
        })
      } else if (err === 'not activate') {
        this.setState({
          invalid:{
            password:false,
            username:true,
            activate:true
          }
        })
      } else if (err === 'password wrong') {
        this.setState({
          invalid:{
            password:true,
            username:false
          }
        })
      }
    })
  }

  render() {
    return <Container className="my-5 py-5">
      <div className="d-flex justify-content-center">
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
      </div>
      <div className="text-center my-5">
        <SocialLogin />
      </div>
  </Container>
  }
}

export default connectWithoutDone(
    (state:RootState)=> ({
      auth:state.auth
    }),
    (dispatch:Dispatch)=> ({
        AuthAction: binding(AuthAction, dispatch)
    }),
    SignIn
)