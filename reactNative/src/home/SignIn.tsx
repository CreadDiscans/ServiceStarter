import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { Input, Button, Icon } from 'react-native-elements';
import { S } from '../core/S';
import { Api } from '../core/Api';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

class SignIn extends React.Component<Props> {
    
    // _signInAsync = async() => {
    //     await AsyncStorage.setItem('userToken', 'token');
    //     this.props.navigation.navigate('Home')
    // }

    state = {
        username:'',
        password:''
    }

    async signIn(type:string) {
        if (type === 'email') {
            // const res = await Api.signin(this.state.username, this.state.password)
            // console.log(res)
        }
    }
    
    render() {
        return <View style={S.pad}>
            <Input placeholder="Username" 
                label="Username"
                leftIcon={{type:'font-awesome', name:'user'}}
                errorMessage="The email is invalid" 
                value={this.state.username}
                onChangeText={(e)=>this.setState({username:e})}
                autoCapitalize={'none'}/>
            <Input placeholder="Password" label="Password"
                leftIcon={{type:'font-awesome', name:'lock'}}
                value={this.state.password}
                onChangeText={(e)=>this.setState({password:e})}
                errorMessage="The password is wrong"
                secureTextEntry={true}
                autoCapitalize={'none'}/>
            <View style={S.pad}>
                <Button title="Sign In" onPress={()=>this.signIn('email')}/>
            </View>
            <View style={[S.row]}>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#d5473a'}]} title="Google" onPress={()=>this.signIn('google')}/>
                </View>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#4064ad'}]} title="Facebook" onPress={()=>this.signIn('facebook')}/>
                </View>
            </View>
            <View style={[S.row]}>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#2caf00'}]} title="Naver" onPress={()=>this.signIn('naver')}/>
                </View>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#fcdc2f'}]} title="Kakao" onPress={()=>this.signIn('kakao')}/>
                </View>
            </View>
        </View>
    }
}

export default connect(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({})
)(SignIn)