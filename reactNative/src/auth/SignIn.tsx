import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { Input, Button, Icon, Overlay } from 'react-native-elements';
import { S } from '../core/S';
import { binding } from '../core/connection';
import { AuthAction } from './Auth.action';
import SocialSign from './SocialSign';

interface Props {
    AuthAct:typeof AuthAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

class SignIn extends React.Component<Props> {

    state = {
        username:'',
        password:'',
        errUsername:'',
        errPassword:''
    }

    async signIn() {
        const {AuthAct, navigation} = this.props
        AuthAct.signIn(this.state.username, this.state.password)
        .then(res=> navigation.navigate('Home'))
        .catch(err=>{
            const state = {errUsername:'', errPassword:''}
            if (err === 'no user') state.errUsername =  'The username not exists.'
            if (err === 'password wrong') state.errPassword = 'The Password was wrong.'
            this.setState(state)
        })
    }
    
    render() {
        return <View style={S.pad}>
            <Input placeholder="Username" 
                label="Username"
                leftIcon={{type:'font-awesome', name:'user'}}
                errorMessage={this.state.errUsername}
                value={this.state.username}
                onChangeText={(e)=>this.setState({username:e})}
                autoCapitalize={'none'}/>
            <Input placeholder="Password" label="Password"
                leftIcon={{type:'font-awesome', name:'lock'}}
                value={this.state.password}
                onChangeText={(e)=>this.setState({password:e})}
                errorMessage={this.state.errPassword}
                secureTextEntry={true}
                autoCapitalize={'none'}/>
            <View style={S.pad}>
                <Button title="Sign In" onPress={()=>this.signIn()}/>
            </View>
            <View style={S.pad}>
                <Button title="Sign Up" onPress={()=>this.props.navigation.navigate('SignUp')}/>
            </View>
            <SocialSign navigation={this.props.navigation}/>
        </View>
    }
}

export default connect(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    })
)(SignIn)