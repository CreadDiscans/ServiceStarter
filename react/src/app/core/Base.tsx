import React from 'react';

export class Base<P={},S={}> extends React.Component<P,S> {
    componentDidMount() {
        this.setState({})
    }
    lastState!:string
    bind(props:P, state:S) {}
    shouldComponentUpdate(props:P, state:S) {
        this.bind(props, state)
        const str_state = JSON.stringify(state)
        if (this.lastState !== str_state) {
            this.lastState = str_state
            return true
        }
        return false
    }
}