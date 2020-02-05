import React from 'react';
import { AuthState } from 'auth/Auth.action';
import { History } from 'history';
interface Props {
    auth:AuthState
    history:History
}
export class SessionChecker extends React.Component<Props> {

    componentDidUpdate() {
        const {auth, history} = this.props;
        if (!auth.userProfile) {
            history.push('/signin')
        }
    }

    render() {
        return <div></div>
    }
}