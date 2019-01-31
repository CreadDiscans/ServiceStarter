import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './componenet/Header';
import Footer from './componenet/Footer';
import Home from './componenet/Home';
import Login from './componenet/Login';

class App extends Component {
  styleApp = {
    minHeight: '100vh'
  }
  render() {
    return (
      <div style={this.styleApp}>
        <Header />
        <Switch>
          <Route exact={true} path="/login" component={Login} />
          <Route path="/" component={Home} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default App;
