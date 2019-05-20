import React from 'react';
import {Alert} from 'reactstrap';
import AuthService from '../../service/auth.service';
export default class Login extends React.Component<any,any> {
  state = {
    open: false,
    username: '',
    password: ''
  }

  handleClick = () => {
    AuthService.login(this.state.username, this.state.password).subscribe(res=> {
      this.props.history.push('/')
    }, err=> {
      this.setState({
        open: true
      })
      setTimeout(()=> {
        this.setState({
          open: false
        })
      }, 3000)
    })
  }

  handleChange = (e:any) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }

  render() {
    return (
      <div className="container" style={{width:'300px', marginTop:'100px'}}>
        <h2>Login</h2>
        <div className="form-group">
          <input className="form-control" 
            placeholder="username" 
            onChange={this.handleChange} 
            name="username" />
        </div>
        <div className="form-group">
          <input className="form-control" type="password" placeholder="password" 
            name="password"
            onChange={this.handleChange} 
            onKeyPress={this.handleKeyPress}/>
        </div>
        <Alert color="danger" style={this.state.open ? {
          transition: 'opacity 0.5s',
          opacity: 1
        } : {
          transition: 'opacity 0.5s',
          opacity: 0
        }}>
          로그인 실패
        </Alert>
        <div className="form-group">
          <button className="btn btn-light float-right" onClick={this.handleClick}>로그인</button>
        </div>
      </div>
    );
  }
};
