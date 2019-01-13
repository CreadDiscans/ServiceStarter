import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class ThemeContent extends Component {
  themeContent = {
    paddingTop: '40px',
    minHeight: '100vh',
  };
  
  sidebar = {
    minHeight: '100vh'
  }

  render() {
    const menuGroup = this.props.sideMenu.map(group=> 
      <div key={group.name}>
        <h4>{group.name}</h4>
        <ul>
          {
            group.items.map(item=> 
              <li key={item.name}>
                <Link to={item.link}>{item.name}</Link>
              </li>
            )
          }
        </ul>
      </div>
    )
    
    return (
      <div className="container-fluid" style={this.themeContent}>
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light" style={this.sidebar}>
            {menuGroup}
          </nav>
          <main role="main" className="col-md-9 ">
            {this.props.children}
          </main>
        </div>
      </div>
    );
  };
};

export default ThemeContent;