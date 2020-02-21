import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { View, ScrollView, Text  } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Input, Button, Overlay } from 'react-native-elements';
import { S } from '../core/S';
import { binding } from '../core/connection';
import { AuthAction } from './Auth.action';
import { Api } from '../core/Api';

interface Props {
    AuthAct: typeof AuthAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

class SignUp extends React.Component<Props> {

    state = {
        username:'',
        email:'',
        password:'',
        password2:'',
        errUsername:'',
        errEmail:'',
        errPassword:'',
        errPassword2:'',
        popup:false
    }

    async register() {
        const {AuthAct} = this.props
        const res = await Api.list<{username:boolean, email:boolean}>('/api-user/',{
            username:this.state.username.trim(),
            email:this.state.email.trim()
        })
        const state = {errUsername:'', errEmail:'', errPassword:'', errPassword2:''}
        let valid = true
        if (!this.state.username || res.username || this.state.username.indexOf('@') !== -1) {
            state.errUsername = 'The username is used aleady or is invalid.'
            valid = false
        }
        if (!this.state.email || res.email) {
            state.errEmail = 'The email is used already.'
            valid = false
        }
        if (this.state.password.length < 7) {
            state.errPassword = 'The password should be longer than 7.'
            valid = false
        }
        if (this.state.password !== this.state.password2) {
            state.errPassword2 = 'The two passwords are not matched.'
            valid = false
        }
        this.setState(state)
        if (valid) {
            AuthAct.signUp(this.state.username, this.state.email, this.state.password)
            .then(res=>{
                this.setState({popup:true})
            })
            .catch(err=>console.log(err))
        }
    }

    render(){
        return<ScrollView style={S.pad}>
            <Input placeholder="Username" 
                label="Username"
                leftIcon={{type:'font-awesome', name:'user'}}
                errorMessage={this.state.errUsername} 
                value={this.state.username}
                onChangeText={(e)=>this.setState({username:e})}
                autoCapitalize={'none'}/>
            <Input placeholder="Email" 
                label="Email"
                leftIcon={{type:'font-awesome', name:'envelope'}}
                errorMessage={this.state.errEmail} 
                value={this.state.email}
                onChangeText={(e)=>this.setState({email:e})}
                autoCapitalize={'none'}/>
            <Input placeholder="Password" label="Password"
                leftIcon={{type:'font-awesome', name:'lock'}}
                value={this.state.password}
                onChangeText={(e)=>this.setState({password:e})}
                errorMessage={this.state.errPassword}
                secureTextEntry={true}
                autoCapitalize={'none'}/>
            <Input placeholder="Password Confirm" label="Password Confirm"
                leftIcon={{type:'font-awesome', name:'lock'}}
                value={this.state.password2}
                onChangeText={(e)=>this.setState({password2:e})}
                errorMessage={this.state.errPassword2}
                secureTextEntry={true}
                autoCapitalize={'none'}/>
            <View style={S.margin}>
                <Button title={'Register'} onPress={()=>this.register()}/>
            </View>
            <Overlay
                isVisible={this.state.popup}>
                <View style={[S.pad, S.center]}>
                    <View style={{marginBottom:30}}>
                        <Text>The Authenticate mail was sent.</Text>
                        <Text>Please check the email.</Text>
                    </View>
                    <Button title={'Sign In'} onPress={()=>this.props.navigation.goBack()}></Button>
                </View>
            </Overlay>
        </ScrollView>
    }
}

export default connect(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    })
)(SignUp)