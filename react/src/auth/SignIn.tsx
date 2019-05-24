import React from 'react';
import { login } from 'auth/Auth.api';

class SignIn extends React.Component<any> {

  state = {
    username:'',
    password:''
  }

  signIn() {
    login(this.state.username, this.state.password)
      .then(res=>console.log(res)) // 로그인 성공
      .catch(err=> console.log(err)) // 로그인 실패
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
    </div>
  }
}

export default SignIn;