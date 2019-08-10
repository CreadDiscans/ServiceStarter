import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { AuthAction, authActions } from './Auth.action';
import { RootState } from 'app/Reducers';
import { connectWithoutDone } from 'app/core/connection';
import { AuthState } from './Auth.type';

interface Props {
  auth: AuthState,
  AuthAction: typeof AuthAction
}

class SignIn extends React.Component<Props> {

  state = {
    username:'',
    password:''
  }

  signIn() {
    const { AuthAction } = this.props;
    AuthAction.signIn(this.state.username, this.state.password)
    .then(res=>console.log('성공', res))
    .catch(()=>console.log('실패'))
  }

  signOut() {
    const { AuthAction } = this.props;
    AuthAction.signOut();
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
    (state:RootState)=> ({
      auth: state.auth
    }),
    (dispatch:Dispatch)=> ({
        AuthAction: bindActionCreators(authActions, dispatch)
    }),
    SignIn
)