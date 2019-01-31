import React from 'react';
import {Alert} from 'reactstrap';
import {DataService} from '../service/DatsService';
import { ConnectService } from '../service/ConnectService';
export default class Login extends React.Component {
  state = {
    open: false,
    username: '',
    password: ''
  }

  componentWillMount() {
    this.dataService = DataService.getInstance();
    this.connectService = ConnectService.getInstance();
    this.asyncPool = [];
  }

  componentWillUnmount() {
    this.asyncPool.forEach(obserbe=> {
      obserbe.unsubscribe();
    })
  }

  handleClick = () => {
    this.asyncPool.push(
      this.dataService.login(this.state.username, this.state.password).subscribe(result=> {
        this.connectService.get('login').next({login: true});
        this.props.history.push('/');
      }, err=> {
        this.setState({
          open: true
        });
        setTimeout(()=> {
          this.setState({
            open: false
          })
        }, 3000)
      })
    );
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }

  render() {
    return (
      <div className="container">
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
          opacity: '1'
        } : {
          transition: 'opacity 0.5s',
          opacity: '0'
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
