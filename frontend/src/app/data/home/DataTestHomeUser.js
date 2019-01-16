import {DataTestApi} from '../index';

class DataTestHomeUser extends DataTestApi {
  componentWillReceiveProps() {
    this.url = 'home/user/';
    this.title = 'Home User';
    this.setState({
      'username':'',
      'password':'',
      'email':'',
      'groups':''
    })
  }
};

export default DataTestHomeUser;