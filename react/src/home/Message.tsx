import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';

class Message extends React.Component {

    state:any = {
        input_1:'',
        input_2:'',
        message1: [],
        message2: []
    }

    socket1!:WebSocket
    socket2!:WebSocket

    componentDidMount() {
        this.user_1_socket()
        this.user_2_socket()
    }

    componentWillUnmount() {
        this.socket1.close()
        this.socket2.close()
    }

    user_1_socket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const room_name = 'chat';
        this.socket1 = new WebSocket(protocol + '//' + window.location.host + '/ws/message/'+room_name+'/');
        this.socket1.onopen = (ev) => {
            console.log(ev)
        }
        this.socket1.onclose = (ev) => {
            console.log(ev)
        }
        this.socket1.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            if (data.to == 'user_1') {
                this.state.message1.push(data.body)
                this.setState({message1:this.state.message1})
            }
            console.log(ev)
        }
        this.socket1.onerror = (err) => {
            console.log(err)
        }
    }

    user_2_socket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const room_name = 'chat';
        this.socket2 = new WebSocket(protocol + '//' + window.location.host + '/ws/message/'+room_name+'/');
        this.socket2.onopen = (ev) => {
            console.log(ev)
        }
        this.socket2.onclose = (ev) => {
            console.log(ev)
        }
        this.socket2.onmessage = (ev) => {
            const data = JSON.parse(ev.data);
            if (data.to == 'user_2') {
                this.state.message2.push(data.body)
                this.setState({message2:this.state.message2})
            }
            console.log(ev)
        }
        this.socket2.onerror = (err) => {
            console.log(err)
        }
    }

    sendMessage(user:string) {
        if (user == 'user_1') {
            this.socket1.send(JSON.stringify({
                to: 'user_2',
                body: this.state.input_1
            }))
            this.setState({input_1:''})
        } else if (user == 'user_2') {
            this.socket2.send(JSON.stringify({
                to: 'user_1',
                body: this.state.input_2
            }))
            this.setState({input_2:''})
        }
    }

    render() {
        return <div>
            <h1>message</h1>
            <div>
                <h4>User 1</h4>
                {this.state.message1.map((item:string, i:number)=> <div key={i}>{item}</div>)}
                <input 
                    onChange={e=> this.setState({input_1:e.target.value})} 
                    value={this.state.input_1} />
                <button onClick={()=> this.sendMessage('user_1')}>전송</button>
            </div>
            <div>
                <h4>User 2</h4>
                {this.state.message2.map((item:string, i:number)=> <div key={i}>{item}</div>)}
                <input 
                    onChange={e=> this.setState({input_2:e.target.value})} 
                    value={this.state.input_2} />
                <button onClick={()=> this.sendMessage('user_2')}>전송</button>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    Message
)