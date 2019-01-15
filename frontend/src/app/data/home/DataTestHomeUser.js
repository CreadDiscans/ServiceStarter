import DataTestFrame from '../DataTestFrame';

class DataTestHomeUser extends DataTestFrame {
  componentWillMount() {
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