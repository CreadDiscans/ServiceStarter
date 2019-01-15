import React, { Component, Fragment } from 'react';
import { Switch } from 'react-router-dom';
import * as A from 'app';


class Main extends Component {

  sideMenu = [];

  render() {
    return (
      <Fragment>
        <A.ThemeHeader />
        <A.ThemeContent sideMenu={this.sideMenu}>
          <Switch>
          </Switch>
        </A.ThemeContent>
        <A.ThemeFooter />
      </Fragment>
    );
  }
}

export default Main;