import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Container, Form, Row, Col, FormGroup, Label, Input, FormFeedback, Button } from 'reactstrap';
import { Api } from 'app/core/Api';
import { AlertSubject } from 'component/Alert';
import { History } from 'history';
interface Props {
    location:Location
    history:History
}

class Reset extends React.Component<Props> {

    state = {
        email:'',
        invalid:false,
        uid:undefined,
        token:undefined,
        password:'',
        password2:'',
        password_invalid:false,
        password2_invalid:false
    }

    componentDidMount() {
        const path = this.props.location.pathname.split('/')
        if (path.length > 3) {
            this.setState({
                uid:path[2],
                token:path[3]
            })
        }
    }

    async submit(e:React.FormEvent<HTMLFormElement>) {
        e.stopPropagation()
        e.preventDefault()
        const res = await Api.list<{username:boolean,email:boolean}>('/api-user/', {
            username:'tmp',
            email:this.state.email
        })
        if (!res.email) {
            this.setState({invalid:true})
            return Promise.resolve()
        }
        Api.list('/send_reset_mail', {
            email:this.state.email
        }).then(res=> {
            this.setState({invalid:false})
            AlertSubject.next({
                title:'Password Reset',
                content:'Password Reset Mail sent. Check the email.',
                onConfirm:()=>AlertSubject.next(undefined)
            })
        })
    }

    async reset(e:React.FormEvent<HTMLFormElement>) {
        e.stopPropagation()
        e.preventDefault()
        const state:any = {}
        state.password_invalid = this.state.password.length < 7
        state.password2_invalid = this.state.password !== this.state.password2
        this.setState(state)
        if (!state.password_invalid && !state.password2_invalid) {
            Api.create('/send_reset_mail',{
                password:this.state.password,
                uid:this.state.uid,
                token:this.state.token
            }).then(res=> {
                AlertSubject.next({
                    title:'Password Reset',
                    content:'Successfully reset.',
                    onConfirm:()=> {
                        this.props.history.push('/signin')
                        AlertSubject.next(undefined)
                    }
                })
            })
            .catch(err=> {
                AlertSubject.next({
                    title:'Password Reset',
                    content:'This link was expired. please try from sending reset email.',
                    onConfirm:()=> {
                        AlertSubject.next(undefined)
                    }
                })
            })
        }
    }

    render() {
        return <Container className="my-5 py-5 d-flex justify-content-center">
            {(this.state.token && this.state.uid) ?
            <Form className="w-100" style={{maxWidth:500}} onSubmit={(e)=>this.reset(e)}>
                <Row form>
                    <Col>
                    <h2>Password Reset</h2>
                    <FormGroup>
                        <Label>New Password</Label>
                        <Input type="password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} 
                        invalid={this.state.password_invalid} />
                        <FormFeedback>The password should be longer than 7 character.</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label>Password Confirm</Label>
                        <Input type="password" value={this.state.password2} onChange={(e)=>this.setState({password2:e.target.value})} 
                        invalid={this.state.password2_invalid} />
                        <FormFeedback>Two passwords are not matched.</FormFeedback>
                    </FormGroup>
                    <div className="text-center">
                        <Button className="mx-2" color="primary" >Reset</Button>
                    </div>
                    </Col>
                </Row>
            </Form> :
            <Form className="w-100" style={{maxWidth:500}} onSubmit={(e)=>this.submit(e)}>
                <Row form>
                    <Col>
                    <h2>Send Password Reset Mail</h2>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input type="email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} 
                        invalid={this.state.invalid} />
                        <FormFeedback>The email not exists.</FormFeedback>
                    </FormGroup>
                    <div className="text-center">
                        <Button className="mx-2" color="primary" >Send Mail</Button>
                    </div>
                    </Col>
                </Row>
            </Form>}
        </Container>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    Reset
)