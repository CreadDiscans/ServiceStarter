import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import {  SharedState } from './Shared.action';
interface Props {
    shared:SharedState
}
export class Alert extends React.Component<Props>{

    render() {
        const {shared} = this.props
        return <Modal isOpen={shared.alert !== undefined}>
            <ModalHeader>{shared.alert && shared.alert.title}</ModalHeader>
            <ModalBody style={{whiteSpace:'pre'}}>{shared.alert && shared.alert.content}</ModalBody>
            <ModalFooter>
                {shared.alert && shared.alert.onConfirm && <Button color="primary" onClick={()=>shared.alert && shared.alert.onConfirm && shared.alert.onConfirm()}>Confirm</Button>}
                {shared.alert && shared.alert.onCancel && <Button color="secondary" onClick={()=>shared.alert && shared.alert.onCancel && shared.alert.onCancel()}>Cancel</Button>}
            </ModalFooter>
        </Modal>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({shared:state.shared}),
    (dispatch:Dispatch)=>({}),
    Alert
)