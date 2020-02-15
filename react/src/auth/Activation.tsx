import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button } from 'reactstrap';
import { History } from 'history';
import { translation } from 'component/I18next';

interface Props {
    history:History
}

class Activation extends React.Component<Props> {

    t = translation('activation',[
        'title','move'
    ])
    render() {
        return <div>
            <div className="m-5 p-5 text-center">
                <h3>{this.t.title}</h3>
                <Button color="primary" onClick={()=>this.props.history.push('/signin')}>{this.t.move}</Button>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    Activation
)