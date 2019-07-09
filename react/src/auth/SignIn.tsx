import React from 'react';
import {  connection, Props } from 'app/Reducers';

class SignIn extends React.Component<Props> {

  state = {
    username:'',
    password:''
  }

  componentWillMount() {
      this.props.done();
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

export default connection(SignIn);