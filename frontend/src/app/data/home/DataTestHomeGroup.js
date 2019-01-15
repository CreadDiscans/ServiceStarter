import DataTestFrame from '../DataTestFrame';

class DataTestHomeGroup extends DataTestFrame {
  componentWillMount() {
    this.url = 'home/group/';
    this.title = 'Home Group';
    this.setState({
      'name':'',
      // fields added automatically
    })
  }
};

export default DataTestHomeGroup;