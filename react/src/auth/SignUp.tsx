import React from 'react';
import { Dispatch } from 'redux';
import { RootState } from 'app/Reducers';
import { connectWithoutDone } from 'app/core/connection';
import { Container, Row, Col, Input, FormGroup, Label, Form, Button, FormFeedback } from 'reactstrap';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import * as CustomType from 'types/custom.types';
import { History } from 'history';
import { AlertSubject } from 'component/Alert';
interface Props {
  history:History
}

class SignUp extends React.Component<Props> {

  state = {
    username: '',
    email: '',
    password: '',
    password2: '',
    invalid:{
      username:false,
      email:false,
      password:false,
      password2:false
    },
    valid: {
      username:false,
      email:false,
      password:false,
      password2:false
    }
  }

  async signUp() {
    const user = await Api.create<CustomType.auth.User>('/api-user/',{
      username:this.state.username.trim(),
      email:this.state.email.trim(),
      password:this.state.password
    })
    const jwt = await Api.create<{token:string}>('/api/token-auth/', {
      username:this.state.username.trim(),
      password:this.state.password
    })
    Api.signIn(jwt.token, undefined);
    const profile = await Api.create<ApiType.Profile>('/api-profile/', {
      user: user.id
    })
    AlertSubject.next({
      title:'Successful Sing Up.',
      content:'Please login after checking Activation email.',
      onConfirm:()=> {
        this.props.history.push('/signin')
        AlertSubject.next(undefined)
      }
    })
  }

  submit(e:React.FormEvent<HTMLFormElement>) {
    e.stopPropagation()
    e.preventDefault()
    Promise.all([
      Api.list<ApiType.Profile[]>('/api-profile/',{
        user__username:this.state.username.trim()
      }),
      Api.list<ApiType.Profile[]>('/api-profile/',{
        user__email:this.state.email.trim()
      })
    ]).then(res=>{
      console.log(res)
      let state:any = {invalid:{...this.state.invalid}, valid:{...this.state.valid}}
      this.checkValid(res[0].length !== 0, 'username', state, this.state.username.trim() === '')
      this.checkValid(res[1].length !== 0, 'email', state, this.state.email.trim() === '')
      this.checkValid(this.state.password.length < 7, 'password', state)
      this.checkValid(this.state.password !== this.state.password2, 'password2', state)
      this.setState(state)
      if (Object.keys(state.valid).filter(key=>state.valid[key]).length === 4) {
        this.signUp()
      }
    })
  }

  checkValid(expression:boolean, key:string, state:any, init=false) {
    if (init) {
      state.invalid[key] = false
      state.valid[key] = false
    } else {
      if (expression) {
        state.invalid[key] = true;
        state.valid[key] = false;
      } else {
        state.invalid[key] = false;
        state.valid[key] = true;
      }
    }
  }

  render() {
    return <Container className="my-5 py-5 d-flex justify-content-center">
      <Form className="w-100" style={{maxWidth:400}} onSubmit={(e)=>this.submit(e)}>
        <Row form>
          <Col>
            <h2>Sign Up</h2>
            <FormGroup>
              <Label>Username</Label>
              <Input type="text" value={this.state.username} onChange={(e)=>this.setState({username:e.target.value})} 
                invalid={this.state.invalid.username} valid={this.state.valid.username}/>
              <FormFeedback>The username has already registered.</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} 
                invalid={this.state.invalid.email} valid={this.state.valid.email}/>
              <FormFeedback>The email has already registered.</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input type="password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} 
                invalid={this.state.invalid.password} valid={this.state.valid.password}/>
              <FormFeedback>The Password should be longer than 7 character.</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>Password Confirm</Label>
              <Input type="password" value={this.state.password2} onChange={(e)=>this.setState({password2:e.target.value})} 
                invalid={this.state.invalid.password2} valid={this.state.valid.password2}/>
              <FormFeedback>Two passwords are not matched.</FormFeedback>
            </FormGroup>
            <Button color="primary" className="float-right" >Sign Up</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  }
}

export default connectWithoutDone(
  (state:RootState)=> ({}),
  (dispatch:Dispatch)=> ({}),
  SignUp
)