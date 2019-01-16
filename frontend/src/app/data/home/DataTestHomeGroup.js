import {DataTestApi} from '../index';

class DataTestHomeGroup extends DataTestApi {
  componentWillReceiveProps() {
    this.url = 'home/group/';
    this.title = 'Home Group';
    this.setState({
      'name':'',
    })
  }
};

export default DataTestHomeGroup;