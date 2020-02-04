import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button } from 'reactstrap';
import { History } from 'history';

interface Props {
    history:History
}

class Activation extends React.Component<Props> {

    render() {
        return <div>
            <div className="m-5 p-5 text-center">
                <h3>Successfully Activated</h3>
                <Button color="primary" onClick={()=>this.props.history.push('/signin')}>Go to sign in</Button>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    Activation
)