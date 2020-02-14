import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { SharedAction, SharedState } from './Shared.action';
import { Alert } from 'reactstrap';

interface Props {
    shared:SharedState
    SharedAct:typeof SharedAction
}

class Notification extends React.Component<Props> {

    render(){
        const {shared, SharedAct} = this.props;
        return <div style={{position:'fixed', bottom:20, right:30, transition:'0.5s all'}}>
            <Alert color="primary" isOpen={shared.notification !== undefined} onClick={()=> {
                    shared.notification && shared.notification.onClick && shared.notification.onClick()
                }} toggle={()=>SharedAct.notify(undefined)} fade={true}>
                {shared.notification && shared.notification.content}
            </Alert>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        shared:state.shared
    }),
    (dispatch:Dispatch)=>({
        SharedAct:binding(SharedAction, dispatch)
    }),
    Notification
)