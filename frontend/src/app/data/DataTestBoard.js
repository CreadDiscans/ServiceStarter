import React, {Component} from 'react';
class DataTestBoard extends Component {
  
  render() {
    return (
      <div>
        <h3>Board Group</h3>
        <div>
          <button className="btn btn-secondary">get Board Group</button>
        </div>
        <div>
          <button className="btn btn-secondary">create Board Group</button>
        </div>
        <div>
          <button className="btn btn-secondary">update Board Group</button>
        </div>
        <div>
          <button className="btn btn-secondary">delete Board Group</button>
        </div>
      </div>
    );
  }
};

export default DataTestBoard;