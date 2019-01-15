import React, {Component} from 'react';
import DataService from 'service/DataService';

class DataTestFrame extends Component {
  url='';
  title='';
  state = {
    'id':'',
    'page': ''
  }
  componentDidMount() {
    this.dataService = new DataService();
  }
  handleChange = (e) => {
    this.setState({[e.target.name]:e.target.value});
  }
  handleClick = (e) => {
    switch(e.target.name) {
      case 'get':
        this.dataService.select(this.url, this.getParam()).subscribe(json=> {
          console.log(json);
        });
        break;
      case 'create':
        this.dataService.create(this.url, this.getParam()).subscribe(json=> {
          console.log(json);
        });
        break;
      case 'retrieve':
        this.dataService.select(this.url+this.state.id+'/').subscribe(json=> {
          console.log(json);
        });
        break;
      case 'update':
        this.dataService.update(this.url+this.state.id+'/', this.getParam()).subscribe(json=> {
          console.log(json);
        });
        break;
      case 'delete':
        this.dataService.delete(this.url+this.state.id+'/', this.getParam()).subscribe(json=> {
          console.log(json);
        });
        break;
      default:
        break;
    }
  }

  getParam() {
    const param = JSON.parse(JSON.stringify(this.state));
    for(let key in param) {
      if (param[key] === '') {
        delete param[key];
      }
    }
    return param;
  }

  render() {
    return (
      <div>
        <h2>{this.title}</h2>
        {
          Object.keys(this.state).map((key)=> {
            return (
            <div key={key}>
              <input placeholder={key} 
                value={this.state[key]} 
                onChange={this.handleChange}
                name={key}/>
            </div>
          )})
        }
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="get">get</button></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="create">create</button></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="retrieve">retrieve</button></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="update">update</button></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="delete">delete</button></div>
      </div>
    );
  }
};

export default DataTestFrame;