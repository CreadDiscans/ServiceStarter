import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../redux/modules/users';
import { withDone } from 'react-router-server';

class Users extends React.Component<any> {
  componentWillMount() {
    const { UsersActions, data, done } = this.props;
    if (data.length !== 0) return false;
    UsersActions.getUsers().then(done, done);
  }

  render() {
    const { data } = this.props;
    const userList = data.map(
      (user:any) => <li key={user.id}>{user.name}</li>
    );

    return (
      <div>
        <ul>
          {userList}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state:any) => {
  return {
    data:state.users.data
  }
}

const mapDispatchToProps = (dispatch:any) => {
  return {
    UsersActions: bindActionCreators(userActions, dispatch)
  }
}

const connectItem:any = connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);

export default withDone(connectItem);