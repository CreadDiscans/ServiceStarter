import React, {Component} from 'react';
import DataService from 'service/DataService';

class DataTestFrame extends Component {
  state = {
    'username':'',
    'password':''
  }
  componentDidMount() {
    this.dataService = new DataService();
  }
  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value});
  }
  handleClick = (e) => {
    switch(e.target.name) {
      case 'in':
        this.dataService.signin(this.state.username, this.state.password).subscribe(result=> {
          console.log(result);
        });
        break;
      case 'out':
        this.dataService.signout();
        break;
      case 'check':
        this.dataService.isSigned().subscribe(result=> {
          console.log(result);
        })
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <h2>Home Sign</h2>
        <div><input placeholder="username" value={this.state.username} onChange={this.handleChange} name="username"/></div>
        <div><input placeholder="password" value={this.state.password} onChange={this.handleChange} name="password" type="password"/></div>

        <div><button className="btn btn-secondary" onClick={this.handleClick} name="in">sign in</button></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="out">sign out</button></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="check">check</button></div>
      </div>
    );
  }
};

export default DataTestFrame;