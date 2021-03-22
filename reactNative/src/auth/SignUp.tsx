import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { View, ScrollView, Text  } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Input, Button, Overlay } from 'react-native-elements';
import { S } from '../core/S';
import { binding, chain } from '../core/connection';
import { AuthAction } from './Auth.action';
import { Api } from '../core/Api';
import { TFunction } from 'i18next';

interface Props {
    AuthAct: typeof AuthAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
    t: TFunction
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
        const {AuthAct,t} = this.props
        const res = await Api.list<{username:boolean, email:boolean}>('/api-user/',{
            username:this.state.username.trim(),
            email:this.state.email.trim()
        })
        const state = {errUsername:'', errEmail:'', errPassword:'', errPassword2:''}
        let valid = true
        if (!this.state.username || res.username || this.state.username.indexOf('@') !== -1) {
            state.errUsername = t('signup.usernameinvalid')
            valid = false
        }
        if (!this.state.email || res.email) {
            state.errEmail = t('signup.emailinvalid')
            valid = false
        }
        if (this.state.password.length < 7) {
            state.errPassword = t('signup.passwordinvalid')
            valid = false
        }
        if (this.state.password !== this.state.password2) {
            state.errPassword2 = t('signup.passwordconfirminvalid')
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
        const { t } = this.props
        return<ScrollView style={S.pad}>
            <Input placeholder={t('signup.username')}
                label={t('signup.username')}
                leftIcon={{type:'font-awesome', name:'user'}}
                errorMessage={this.state.errUsername} 
                value={this.state.username}
                onChangeText={(e)=>this.setState({username:e})}
                autoCapitalize={'none'}/>
            <Input placeholder={t('signup.email')}
                label={t('signup.email')}
                leftIcon={{type:'font-awesome', name:'envelope'}}
                errorMessage={this.state.errEmail} 
                value={this.state.email}
                onChangeText={(e)=>this.setState({email:e})}
                autoCapitalize={'none'}/>
            <Input placeholder={t('signup.password')} label={t('signup.password')}
                leftIcon={{type:'font-awesome', name:'lock'}}
                value={this.state.password}
                onChangeText={(e)=>this.setState({password:e})}
                errorMessage={this.state.errPassword}
                secureTextEntry={true}
                autoCapitalize={'none'}/>
            <Input placeholder={t('signup.passwordconfirm')} label={t('signup.passwordconfirm')}
                leftIcon={{type:'font-awesome', name:'lock'}}
                value={this.state.password2}
                onChangeText={(e)=>this.setState({password2:e})}
                errorMessage={this.state.errPassword2}
                secureTextEntry={true}
                autoCapitalize={'none'}/>
            <View style={S.margin}>
                <Button title={t('signup.signup')} onPress={()=>this.register()}/>
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

export default chain(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    }),SignUp
)