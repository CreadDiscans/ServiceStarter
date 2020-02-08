import React from 'react';
import { AuthState } from 'auth/Auth.action';
import { History } from 'history';
interface Props {
    auth:AuthState
    history:History
}
export class SessionChecker extends React.Component<Props> {

    state = {}

    static getDerivedStateFromProps(props:Props, state:any) {
        const {auth, history} = props;
        if (!auth.userProfile) {
            history.push('/signin')
        }
        return null;
    }

    render() {
        return <div></div>
    }
}