import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './componenet/Header';
import Footer from './componenet/Footer';
import Home from './componenet/Home';
import Login from './componenet/Login';
import Next from './componenet/Next';
import { ConnectService } from './service/ConnectService';

class App extends Component {
  styleApp = {
    minHeight: '100vh'
  }
  state = {
    isLogined: false
  }

  componentWillMount() {
    this.connectService = ConnectService.getInstance();
    this.connectService.get('login').subscribe(obj=> {
      this.setState({
        isLogined: obj.login
      })
    })
  }

  render() {
    return (
      <div style={this.styleApp}>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          {this.state.isLogined && <Route exact={true} path="/next" component={Next} />}
          <Route path="*" render={() => (<Redirect to="/" />)} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default App;
