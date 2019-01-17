import React, {Component} from 'react';
const $ = window.$;
class BSAlert extends Component {
  componentWillMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  open = () => {
    $('.alert').alert();
    // console.log(this);
    console.log('open');
  }

  close = () => {
    $('.alert').alert('close');
    console.log('close');
  }

  toggle = () => {
    $('.alert').alert('dispose');
    console.log('dispose');
  }

  render() {
    return (
      <div className={'alert alert-'+this.props.color} role="alert" data-dismiss="alert">
        {this.props.children}
      </div>
    );
  }
};

export default BSAlert;