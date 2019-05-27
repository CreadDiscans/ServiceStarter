import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { bindActionCreators } from 'redux';
import * as authActions from 'auth/Auth.action';

class SignIn extends React.Component<any> {

  state = {
    username:'',
    password:''
  }

  signIn() {
    const { AuthActions } = this.props;
    AuthActions.signIn(this.state.username, this.state.password)
    .then((res:any)=>console.log('성공', res))
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
          onChange={(e:any)=> this.setState({username:e.target.value})}
          placeholder={'username'} />
      </div>
      <div>
        <input type="password"
          value={this.state.password}
          onChange={(e:any)=> this.setState({password:e.target.value})}
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
  (state:any)=> ({
    data: state.auth
  }),
  (dispatch:any)=>({
    AuthActions: bindActionCreators(authActions, dispatch)
  }),
  SignIn
);