import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch, bindActionCreators } from 'redux';
import { History } from 'history';
import { AuthState, AuthAction } from 'auth/Auth.action';
import { FaBars } from 'react-icons/fa';
import { Collapse, Button } from 'reactstrap';
import { translation } from 'component/I18next';
interface Props {
  auth:AuthState
  AuthAction: typeof AuthAction
  location:Location
  history:History
}

class Header extends React.Component<Props> {

  t = translation('header', [
    'dashboard',
    'board',
    'mypage',
    'signout',
    'signin',
    'signup'
  ])
  state = {
    collapse:false
  }

  render() {
    const { auth, AuthAction } = this.props
    return <nav className={this.props.location.pathname === '/' ? 
      'navbar navbar-expand-lg navbar-dark fixed-top' : "navbar navbar-expand-lg navbar-dark fixed-top navbar-shrink"}   id="mainNav">
      <div className="container">
        <a className="navbar-brand js-scroll-trigger" onClick={()=>this.props.history.push('/')}>Start Bootstrap</a>
        <Button className="navbar-toggler navbar-toggler-right" onClick={()=>this.setState({collapse:!this.state.collapse})}>
          Menu
          <FaBars />
        </Button>
        <Collapse isOpen={this.state.collapse} className="navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ml-auto">
            <li className="nav-item">
              <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/dashboard')}>{this.t.dashboard}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/board')}>{this.t.board}</a>
            </li>
            {auth.userProfile ? [
              <li className="nav-item" key={0}>
                <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/mypage')}>{this.t.mypage}</a>
              </li>,
              <li className="nav-item" key={1}>
                <a className="nav-link js-scroll-trigger" onClick={()=>AuthAction.signOut()}>{this.t.signout}</a>
              </li>
            ] : [
              <li className="nav-item" key={0}>
                <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/signin')}>{this.t.signin}</a>
              </li>,
              <li className="nav-item" key={1}>
                <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/signup')}>{this.t.signup}</a>
              </li>
            ]}
          </ul>
        </Collapse>
      </div>
    </nav>
  }
}

export default connectWithoutDone(
  (state:RootState)=>({
    auth:state.auth
  }),
  (dispatch:Dispatch)=>({
    AuthAction:binding(AuthAction, dispatch)
  }),
  Header
)