import React, {Component} from 'react';
import DataService from 'service/DataService';

class DataTestBoard extends Component {
  state = {
    'get': {
      'page':''
    },
    'create': {
      'name':''
    },
    'retrieve': {
      'id':''
    },
    'update': {
      'id':'',
      'name':'',
    },
    'delete': {
      'id':''
    }
  }
  componentWillMount() {
    this.dataService = new DataService();
  }
  handleChange = (e) => {
    const key1 = e.target.name.split('.')[0];
    const key2 = e.target.name.split('.')[1];
    this.setState({
      [key1]:{
        [key2]:e.target.value
      }
    });
  }
  handleClick = (e) => {
    switch(e.target.name) {
      case 'get':
        this.dataService.select('board/item/', this.state.get).subscribe(json=> {
          console.log(json);
        });
        break;
      case 'create':
        this.dataService.create('board/item/', this.state.create).subscribe(json=> {
          console.log(json);
        });
        break;
      case 'retrieve':
        this.dataService.select('board/item/'+this.state.retrieve.id+'/').subscribe(json=> {
          console.log(json);
        });
        break;
      case 'update':
        this.dataService.update('board/item/'+this.state.update.id+'/', this.update).subscribe(json=> {
          console.log(json);
        });
        break;
      case 'delete':
        this.dataService.delete('board/item/'+this.state.delete.id+'/', this.delete).subscribe(json=> {
          console.log(json);
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <h2>Board Group</h2>
        <div><input placeholder="page" value={this.state.get.page} onChange={this.handleChange} name="get.page"/></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="get">get Board Group</button></div>
        <hr></hr>
        <div><input placeholder="name" value={this.state.create.name} onChange={this.handleChange} name="create.name"/></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="create">create Board Group</button></div>
        <hr></hr>
        <div><input placeholder="id" value={this.state.retrieve.id} onChange={this.handleChange} name="retrieve.id"/></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="retrieve">retrieve Board Group</button></div>
        <hr></hr>
        <div><input placeholder="id" value={this.state.update.id} onChange={this.handleChange} name="update.id"/></div>
        <div><input placeholder="name" value={this.state.update.name} onChange={this.handleChange} name="update.name"/></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="update">update Board Group</button></div>
        <hr></hr>
        <div><input placeholder="id" value={this.state.delete.id} onChange={this.handleChange} name="delete.id"/></div>
        <div><button className="btn btn-secondary" onClick={this.handleClick} name="delete">delete Board Group</button></div>
      </div>
    );
  }
};

export default DataTestBoard;