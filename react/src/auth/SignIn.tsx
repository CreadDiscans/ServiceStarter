import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { bindActionCreators, Dispatch } from 'redux';
import * as authActions from 'auth/Auth.action';
import { AuthActions } from './Auth.type';
import { AppState } from 'app/Reducers';

interface Props {
  AuthActions: AuthActions;
}

class SignIn extends React.Component<Props> {

  state = {
    username:'',
    password:''
  }

  signIn() {
    const { AuthActions } = this.props;
    AuthActions.signIn(this.state.username, this.state.password)
    .then(res=>console.log('성공', res))
    .catch(()=>console.log('실패'))
  }

  signOut() {
    const { AuthActions } = this.props;
    AuthActions.signOut();
    console.log('로그아웃');
  }

  render() {
    return <div>
      <div>
        <input type="text" 
          value={this.state.username}  
          onChange={e=> this.setState({username:e.target.value})}
          placeholder={'username'} />
      </div>
      <div>
        <input type="password"
          value={this.state.password}
          onChange={e=> this.setState({password:e.target.value})}
          placeholder={'password'} />
      </div>
      <div>
        <button onClick={()=> this.signIn()}>Login</button>
      </div>
      <div>
        <button onClick={()=> this.signOut()}>Logout</button>
      </div>
    </div>
  }
}

export default connectWithoutDone(
  (state:AppState)=> ({}),
  (dispatch:Dispatch)=>({
    AuthActions: bindActionCreators(authActions, dispatch)
  }),
  SignIn
);