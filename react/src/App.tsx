import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomeComponent from './component/home';
import PubsubService from './service/pubsub.service';
import AuthService from './service/auth.service';

class App extends Component {
  state = {
    isLogined: false
  }

  links = [
    {link:'/', component:HomeComponent}
  ]

  componentWillMount() {
    PubsubService.sub(PubsubService.KEY_LOGIN).subscribe((obj:any)=> {
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
        <Switch>
          {this.links.map(item=> <Route 
            exact path={item.link} key={item.link}
            component={item.component}
          />)}
          <Route path="*" render={() => (<Redirect to="/" />)} />
        </Switch>
      </div>
    );
  }
}

export default App;
