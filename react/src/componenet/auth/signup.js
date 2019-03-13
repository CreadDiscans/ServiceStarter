import React from 'react';
import {Alert} from 'reactstrap';
import { RequestService } from '../../service/request.service';

export default class SignUp extends React.Component {
    state = {
        open: false,
        username: '',
        password: '',
        password_confirm: ''
    }

    handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        })
    }

    handleClick = (e) => {
        if (this.state.password !== this.state.password_confirm) {
            this.showAlert()
            return
        }
        RequestService.post('home/user/', {
            username: this.state.username,
            password: this.state.password
        }).subscribe(res=> {
            this.props.history.push('/login')
        }, err=> {
            this.showAlert()
        })
    }

    showAlert = () => {
      this.setState({
        open: true
      })
      setTimeout(()=> {
        this.setState({
          open: false
        })
      }, 3000)
    }

    render() {
        return <div className="container" style={{width:'300px', marginTop:'100px'}}>
          <h2>Sign Up</h2>
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
          <div className="form-group">
            <input className="form-control" type="password" placeholder="password confirm" 
              name="password_confirm"
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
            가입 실패
          </Alert>
          <div className="form-group">
            <button className="btn btn-light float-right" onClick={this.handleClick}>가입하기</button>
          </div>
        </div>
    }
}