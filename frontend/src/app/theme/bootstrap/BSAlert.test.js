import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {BSAlert} from 'app'; 

class BSAlertTest extends Component {
  containerStyle = {
    paddingTop:'30px'
  }

  alerts = {};
  selected = 'primary';
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.conn = this.handleClick;
  }
  handleClick = (e) => {
    if (e.target.name === 'open') {
      this.alerts[this.selected].open();
    } else if (e.target.name === 'close') {
      this.alerts[this.selected].close();
    } else {
      this.alerts[this.selected].toggle();
    }
  }

  handleChange = (e) => {
    this.selected = e.target.value;
  }

  render() {
    return (
      <div className="container" style={this.containerStyle}>
        <div className="row">
          <div className="col-6">
            <select className="form-control" onChange={this.handleChange}>
              <option value="primary">primary</option>
              <option value="secondary">secondary</option>
              <option value="success">success</option>
              <option value="danger">danger</option>
              <option value="warning">warning</option>
              <option value="info">info</option>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </div>
          <div className="col-6">
            <button className="btn btn-info" onClick={this.handleClick} name="open">open</button>
            <button className="btn btn-info" onClick={this.handleClick} name="close">close</button>
            <button className="btn btn-info" onClick={this.handleClick} name="toggle">toggle</button>
          </div>
          <div className="col-12">
            <BSAlert onRef={ref=>{this.alerts['primary'] = ref}} color="primary">A simple primary alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
            <BSAlert onRef={ref=>{this.alerts['secondary'] = ref}} color="secondary">A simple secondary alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
            <BSAlert onRef={ref=>{this.alerts['success'] = ref}} color="success">A simple success alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
            <BSAlert onRef={ref=>{this.alerts['danger'] = ref}} color="danger">A simple danger alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
            <BSAlert onRef={ref=>{this.alerts['warning'] = ref}} color="warning">A simple warning alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
            <BSAlert onRef={ref=>{this.alerts['info'] = ref}} color="info">A simple info alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
            <BSAlert onRef={ref=>{this.alerts['light'] = ref}} color="light">A simple light alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
            <BSAlert onRef={ref=>{this.alerts['dark'] = ref}} color="dark">A simple dark alert with <Link to="#" className="alert-link">an example link</Link>. Give it a click if you like.</BSAlert>
          </div>
        </div>
      </div>
    );
  }
};

export default BSAlertTest;