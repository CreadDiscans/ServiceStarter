import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { BehaviorSubject, Subscription } from 'rxjs';

interface States {
    title:string
    content:string
    onConfirm?:Function
    onCancel?:Function
}

export const AlertSubject = new BehaviorSubject<States|undefined>(undefined) 

export class Alert extends React.Component{

    state:States = {
        title:'',
        content:'',
    }
    sub!:Subscription

    componentDidMount() {
        this.sub = AlertSubject.subscribe(val=> {
            if (val) {
                this.setState(val)
            } else {
                this.setState({})
            }
        })
    }

    componentWillUnmount() {
        this.sub.unsubscribe()
    }

    render() {
        return <Modal isOpen={AlertSubject.value !== undefined}>
            <ModalHeader>{this.state.title}</ModalHeader>
            <ModalBody>{this.state.content}</ModalBody>
            <ModalFooter>
                {this.state.onConfirm && <Button color="primary" onClick={()=>this.state.onConfirm && this.state.onConfirm()}>Confirm</Button>}
                {this.state.onCancel && <Button color="secondary" onClick={()=>this.state.onCancel && this.state.onCancel()}>Cancel</Button>}
            </ModalFooter>
        </Modal>
    }
}