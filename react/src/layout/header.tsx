import React from 'react';
import './agency.min.css';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch, bindActionCreators } from 'redux';
import { History } from 'history';
import { AuthState, AuthAction, authActions } from 'auth/Auth.action';
interface Props {
  auth:AuthState
  AuthAction: typeof AuthAction
  location:Location
  history:History
}

class Header extends React.Component<Props> {

  render() {
    const { auth, AuthAction } = this.props
    return <nav className={this.props.location.pathname === '/' ? 
      'navbar navbar-expand-lg navbar-dark fixed-top' : "navbar navbar-expand-lg navbar-dark fixed-top navbar-shrink"}   id="mainNav">
      <div className="container">
        <a className="navbar-brand js-scroll-trigger" onClick={()=>this.props.history.push('/')}>Start Bootstrap</a>
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu
          <i className="fas fa-bars"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ml-auto">
            {auth.userProfile ? [
              <li className="nav-item" key={0}>
                <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/mypage')}>MyPage</a>
              </li>,
              <li className="nav-item" key={1}>
                <a className="nav-link js-scroll-trigger" onClick={()=>AuthAction.signOut()}>Sign Out</a>
              </li>
            ] : [
              <li className="nav-item" key={0}>
                <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/signin')}>Sign In</a>
              </li>,
              <li className="nav-item" key={1}>
                <a className="nav-link js-scroll-trigger" onClick={()=>this.props.history.push('/signup')}>Sign Up</a>
              </li>
            ]}
          </ul>
        </div>
      </div>
    </nav>
  }
}

export default connectWithoutDone(
  (state:RootState)=>({
    auth:state.auth
  }),
  (dispatch:Dispatch)=>({
    AuthAction:bindActionCreators(authActions, dispatch)
  }),
  Header
)