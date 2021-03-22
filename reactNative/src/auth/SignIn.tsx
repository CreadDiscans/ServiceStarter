import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { Input, Button, Icon, Overlay } from 'react-native-elements';
import { S } from '../core/S';
import { binding, chain } from '../core/connection';
import { AuthAction } from './Auth.action';
import SocialSign from './SocialSign';
import { TFunction } from 'i18next';

interface Props {
    AuthAct:typeof AuthAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>,
    t: TFunction
}

class SignIn extends React.Component<Props> {

    state = {
        username:'',
        password:'',
        errUsername:'',
        errPassword:''
    }

    async signIn() {
        const {AuthAct, navigation, t} = this.props
        AuthAct.signIn(this.state.username, this.state.password)
        .then(res=> navigation.navigate('Home'))
        .catch(err=>{
            const state = {errUsername:'', errPassword:''}
            if (err === 'no user') state.errUsername =  t('signin.notexist')
            if (err === 'password wrong') state.errPassword = t('signin.wrongpassword')
            this.setState(state)
        })
    }
    
    render() {
        const { t } = this.props
        return <View style={S.pad}>
            <Input placeholder={t('signin.username')}
                label={t('signin.username')}
                leftIcon={{type:'font-awesome', name:'user'}}
                errorMessage={this.state.errUsername}
                value={this.state.username}
                onChangeText={(e)=>this.setState({username:e})}
                autoCapitalize={'none'}/>
            <Input placeholder={t('signin.password')} label={t('signin.password')}
                leftIcon={{type:'font-awesome', name:'lock'}}
                value={this.state.password}
                onChangeText={(e)=>this.setState({password:e})}
                errorMessage={this.state.errPassword}
                secureTextEntry={true}
                autoCapitalize={'none'}/>
            <View style={S.pad}>
                <Button title={t('signin.signin')} onPress={()=>this.signIn()}/>
            </View>
            <View style={S.pad}>
                <Button title={t('signin.signup')} onPress={()=>this.props.navigation.navigate('SignUp')}/>
            </View>
            <SocialSign navigation={this.props.navigation}/>
        </View>
    }
}

export default chain(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    }),SignIn
)