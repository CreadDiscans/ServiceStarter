import React from 'react';
import { View, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { S } from '../core/S';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { binding } from '../core/connection';
import { AuthAction, AuthState } from './Auth.action';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import KakaoLogins from '@react-native-seoul/kakao-login';

GoogleSignin.configure({offlineAccess:false})

const naverKeys = Platform.OS === 'android' ? {
    kConsumerKey: "GfwH3vvqAGsA6nx8zX_X",
    kConsumerSecret: "zdvsIqikHd",
    kServiceAppName: "Service Starter"
  } : {
    kConsumerKey: "VC5CPfjRigclJV_TFACU",
    kConsumerSecret: "f7tLFw0AHn",
    kServiceAppName: "테스트앱(iOS)",
    kServiceAppUrlScheme: "testapp" // only for iOS
  }

interface Props {
    auth:AuthState
    AuthAct: typeof AuthAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

class SocialSign extends React.Component<Props> {
    
    async googleLogin() {
        try {
            await GoogleSignin.hasPlayServices();
            const data = await GoogleSignin.signIn();
            const crediencial = await GoogleSignin.getTokens()
            const {AuthAct, auth, navigation}= this.props
            AuthAct.socialSign('google', data.user.id, 
                data.user.name ? data.user.name : 'noname', 
                crediencial.accessToken, auth.fcmToken)
                .then(res=> navigation.navigate('Home'))
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
        }
    }

    async facebookLogin() {
        const result:any = await LoginManager.logInWithPermissions(["public_profile"])
        if (result.isCancelled) {
            console.log("Login cancelled");
        } else {
            const data = await AccessToken.getCurrentAccessToken()
            if (data) {
                new GraphRequestManager().addRequest(new GraphRequest(
                    '/me',null, (err, obj:any)=> {
                        if (obj) {
                            const {AuthAct, auth, navigation} = this.props
                            AuthAct.socialSign('facebook', data.userID, obj.name, data.accessToken, auth.fcmToken)
                            .then(res=> navigation.navigate('Home'))
                        }
                    }
                )).start()
            }
        }
    }

    naverLogin() {
        NaverLogin.login(naverKeys, async(err, token)=> {
            if (token) {
                const result = await getProfile(token.accessToken)
                const {AuthAct, auth, navigation } = this.props
                AuthAct.socialSign('naver', result.response.id, 'noname', token.accessToken, auth.fcmToken)
                .then(res=> navigation.navigate('Home'))
            }
        })
    }

    async kakaoLogin() {
        const result = await KakaoLogins.login()
        const profile = await KakaoLogins.getProfile()
        const {AuthAct, auth, navigation} = this.props
        AuthAct.socialSign('kakao', profile.id, profile.nickname, result.accessToken, auth.fcmToken)
        .then(res=> navigation.navigate('Home'))
    }

    render() {
        return <View>
            <View style={[S.row]}>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#d5473a'}]} title="Google" onPress={()=>this.googleLogin()}/>
                </View>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#4064ad'}]} title="Facebook" onPress={()=>this.facebookLogin()}/>
                </View>
            </View>
            <View style={[S.row]}>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#2caf00'}]} title="Naver" onPress={()=>this.naverLogin()}/>
                </View>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#fcdc2f'}]} title="Kakao" onPress={()=>this.kakaoLogin()}/>
                </View>
            </View>
        </View>
    } 
}

export default connect(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    })
)(SocialSign)