import React from 'react';
import { bindActionCreators } from 'redux';
import * as usersActions from 'users/Users.action';
import connectWithDone from 'app/core/connectWithDone';

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

export default connectWithDone(
  (state: any) => ({
    data: state.users.data
  }),
  (dispatch:any) => ({
    UsersActions: bindActionCreators(usersActions, dispatch)
  }), 
  Users
);