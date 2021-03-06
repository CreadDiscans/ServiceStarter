import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button, ListGroup, ListGroupItem, Progress } from 'reactstrap';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { AuthState } from 'auth/Auth.action';
import { translation } from 'component/I18next';
interface Props {
    auth:AuthState
}

class Task extends React.Component<Props>{

    t = translation('task',[
        "task",
        "newtask",
        "start",
        "delete"
    ])
    sockets:{d:ApiType.TaskWork, s:WebSocket}[] = []

    state:{
        tasks:ApiType.TaskWork[]
    } = {
        tasks:[]
    }

    componentDidMount() {
        this.loadTask()
    }

    componentWillUnmount() {
        this.sockets.forEach(item=>item.s.close())
    }

    async loadTask(){
        const {auth} = this.props;
        if (auth.userProfile) {
            const tasks = await Api.list<ApiType.TaskWork[]>('/api-task/work/',{
                owner:auth.userProfile.id
            })
            tasks.reverse()
            tasks.forEach(t=>this.connectTask(t))
            this.setState({tasks})
        }
    }

    async createTask() {
        const {auth} = this.props;
        if (auth.userProfile) {
            const task = await Api.create<ApiType.TaskWork>('/api-task/work/',{
                owner:auth.userProfile.id,
                status:'ready',
                body:JSON.stringify({
                    task:'one_minute_task'
                })
            })
            this.connectTask(task)
            this.setState({tasks:[...this.state.tasks, task]})
        }
    }

    async deleteTask(item:ApiType.TaskWork) {
        this.disconnectTask(item)
        this.setState({tasks:[...this.state.tasks.filter(t=>t.id !== item.id)]})
        Api.delete('/api-task/work/', item.id)
    }

    disconnectTask(item:ApiType.TaskWork) {
        this.sockets.filter(sock=>sock.d.id === item.id).forEach(sock=>{
            sock.s.close()
        })
        this.sockets = this.sockets.filter(sock=>sock.d.id !== item.id)
    }

    connectTask(item:ApiType.TaskWork) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const socket = new WebSocket(protocol + '//' + window.location.host + '/ws/task/'+item.id+'/');
        socket.onopen = (ev) => console.log(ev)
        socket.onclose = (ev) => console.log(ev)
        socket.onmessage = (ev) => {
            const task:ApiType.TaskWork = JSON.parse(ev.data)
            this.setState({tasks:this.state.tasks.map(t=> t.id === task.id ? task : t)})
        }
        socket.onerror = (ev) => console.log(ev)
        this.sockets.push({d:item, s:socket})
    }

    startTask(item:ApiType.TaskWork) {
        this.sockets.filter(sock=>sock.d.id === item.id).forEach(sock=> {
            sock.s.send(JSON.stringify({
                type:'start',
                work_id:item.id
            }))
        })
    }

    render(){
        return <div>
            <h3>{this.t.task}</h3>
            <ListGroup className="mb-3">
                {this.state.tasks.map(item=> <ListGroupItem key={item.id}>
                    <Progress animated color={item.status} value={item.progress} />
                    <Button className="m-2" color="success" onClick={()=>this.startTask(item)} disabled={item.status==='running'}>{this.t.start}</Button>
                    <Button className="m-2" color="danger" onClick={()=>this.deleteTask(item)}>{this.t.delete}</Button>
                </ListGroupItem>)}
            </ListGroup>
            <Button color="primary" onClick={()=>this.createTask()}>{this.t.newtask}</Button>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({}),
    Task
)