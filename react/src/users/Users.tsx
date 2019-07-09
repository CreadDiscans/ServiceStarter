import React from 'react';
import { connection, Props } from 'app/Reducers';
import { UserUser } from './Users.action';

class Users extends React.Component<Props> {
  componentWillMount() {
    const { UserAction, data, done } = this.props;
    if (data.user.data.length !== 0) return false;
    UserAction.getUsers().then(()=>done(),()=> done());
  }

  render() {
    const { data } = this.props;
    const userList = data.user.data.map(
      (user:UserUser) => <li key={user.id}>{user.name}</li>
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

export default connection(Users);