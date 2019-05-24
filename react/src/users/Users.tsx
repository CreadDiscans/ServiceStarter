import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as usersActions from 'users/Users.action';
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

const connectedPage:any = connect(
  (state: any) => ({
    data: state.users.data
  }),
  (dispatch:any) => ({
    UsersActions: bindActionCreators(usersActions, dispatch)
  })
)(Users)

const done:any = withDone(connectedPage)

export default done;