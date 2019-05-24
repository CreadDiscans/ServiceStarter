import React from 'react';
import connectWithDone from 'app/core/connectWithDone';
import { bindActionCreators } from 'redux';
import * as authActions from 'auth/Auth.action';

class SignIn extends React.Component<any> {

  state = {
    username:'',
    password:''
  }

  signIn() {
    const { AuthActions } = this.props;
    AuthActions.login(this.state.username, this.state.password);
  }

  signOut() {
    const { AuthActions } = this.props;
    AuthActions.logout();
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

export default connectWithDone(
  (state:any)=> ({
    data: state.auth
  }),
  (dispatch:any)=>({
    AuthActions: bindActionCreators(authActions, dispatch)
  }),
  SignIn
);