import React from 'react';
import { connection, Props } from 'app/Reducers';

class SignUp extends React.Component<Props> {

  state = {
    username: '',
    email: '',
    password: ''
  }

  componentWillMount() {
      this.props.done();
  }

  signUp() {
    const { AuthAction } = this.props;
    AuthAction.signUp(this.state.username, this.state.email, this.state.password)
    .then(()=>console.log('성공'))
    .catch(()=>console.log('실패'))
  }

  render() {
    return <div>
      <div><input type="text" value={this.state.username} onChange={(e)=> this.setState({username: e.target.value})} /></div>
      <div><input type="email" value={this.state.email} onChange={(e)=> this.setState({email: e.target.value})} /></div>
      <div><input type="password" value={this.state.password} onChange={(e)=> this.setState({password: e.target.value})} /></div>
      <div><button onClick={()=> this.signUp()}>가입하기</button></div>
    </div>
  }
}

export default connection(SignUp);