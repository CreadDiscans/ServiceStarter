import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './componenet/header';
import Footer from './componenet/footer';
import Home from './componenet/home';
import Login from './componenet/auth/login';
import Next from './componenet/next';
import PubsubService from './service/pubsub.service';
import AuthService from './service/auth.service';
import SignUp from './componenet/auth/signup';

class App extends Component {
  state = {
    isLogined: false
  }

  componentWillMount() {
    PubsubService.sub(PubsubService.KEY_LOGIN).subscribe(obj=> {
      if (obj) {
        this.setState({
          isLogined: obj.login
        })
      }
    })
    new AuthService()
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          {this.state.isLogined && <Route exact={true} path="/next" component={Next} />}
          <Route path="*" render={() => (<Redirect to="/" />)} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default App;
