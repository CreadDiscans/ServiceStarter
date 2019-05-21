import React from 'react';
import { withRouter } from 'react-router';

class HomeComponent extends React.Component<any> {

  render() {
    return <div>Hello</div> 
  }
}

export default withRouter(HomeComponent);