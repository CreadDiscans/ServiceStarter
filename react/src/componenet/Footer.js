import React from 'react';
import {
  Navbar
} from 'reactstrap';

export default class Footer extends React.Component {
  styleFooter = {
    position:'absolute',
    bottom: '0',
    width: '100%'
  }
  render() {
    return (
      <Navbar color="light" light expand="md" style={this.styleFooter}>
        <div className="container">
          <span className="navbar-text">
            Copyrightⓒ2019 Creaddiscans All rights reserved.
          </span>
        </div>
      </Navbar>
    );
  }
};
