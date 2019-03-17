import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import PubsubService from './../service/pubsub.service';
import AuthService from './../service/auth.service';
export default class Header extends React.Component {

  state = {
    isLogined: false
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  componentWillMount() {
    PubsubService.sub(PubsubService.KEY_LOGIN).subscribe(obj=> {
      if (obj) {
        this.setState({
          isLogined: obj.login
        })
      }
    })
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleClick = () => {
    AuthService.logout()
  }
  render() {
    return (
      <div>
          <Navbar color="light" light expand="md">
            <Link className="navbar-brand" to="/">Home</Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                { this.state.isLogined ? (
                  <NavItem>
                    <Link className="nav-link" to="/" onClick={this.handleClick}>Logout</Link>
                  </NavItem>
                ) : (
                  <React.Fragment>
                    <NavItem>
                      <Link className="nav-link" to="/login">Login</Link>
                    </NavItem>
                    <NavItem>
                      <Link className="nav-link" to="/signup">SignUp</Link>
                    </NavItem>
                  </React.Fragment>
                )}
              </Nav>
            </Collapse>
          </Navbar>
        </div>
    );
  }
};
