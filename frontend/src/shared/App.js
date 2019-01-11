import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, About, Post, Posts } from 'pages';
import Menu from '../component/Menu';

class App extends React.Component {
  render() {
    return (
      <div>
        <Menu />
        <Route exact path="/" component={Home}/>
        <Switch>
          <Route path="/about/:name" component={About}/>
          <Route path="/about" component={About}/>
        </Switch>
        <Route path="/posts" component={Posts}/>
      </div>
    );
  }
}

export default App;