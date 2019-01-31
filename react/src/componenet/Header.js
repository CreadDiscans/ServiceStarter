import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import { DataService } from '../service/DatsService';
import { ConnectService } from '../service/ConnectService';
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
    this.dataService = DataService.getInstance();
    this.connectService = ConnectService.getInstance();
    this.connectService.get('login').subscribe(obj=> {
      this.setState({
        isLogined: true
      })
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleClick = () => {
    this.dataService.signout();
    this.setState({
      isLogined: false
    })
  }
  render() {
    return (
      <div>
          <Navbar color="light" light expand="md">
            <Link className="navbar-brand" to="/">Home</Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  { this.state.isLogined ? (
                    <Link className="nav-link" to="/" onClick={this.handleClick}>Logout</Link>
                  ) : (
                    <Link className="nav-link" to="/login">Login</Link>
                  )}
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
    );
  }
};
