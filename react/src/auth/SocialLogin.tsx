import React from 'react';
import { Button } from 'reactstrap';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { AuthAction, AuthState } from './Auth.action';
import { History } from 'history';

declare var window: any;
declare var firebase: any;
declare var Kakao: any;
declare var NaverProvider: any;

let googleProvider: any = null
let facebookProvider: any = null
if (process.env.APP_ENV === 'browser') {
    googleProvider = new firebase.auth.GoogleAuthProvider()
    facebookProvider = new firebase.auth.FacebookAuthProvider()
}
interface Props {
    auth: AuthState
    AuthAction: typeof AuthAction
    history: History
}

class SocialLogin extends React.Component<Props> {
    naverProvider: any
    componentDidMount() {
        this.naverProvider = NaverProvider
        this.naverProvider.init();
    }

    googleLogin() {
        firebase.auth().signInWithPopup(googleProvider).then((result: any) => {
            const { AuthAction, history, auth } = this.props;
            AuthAction.socialSign(
                'google',
                result.additionalUserInfo.profile.id,
                result.additionalUserInfo.profile.name,
                result.additionalUserInfo.profile.email,
                result.credential.accessToken,
                auth.fcmToken
            ).then(() => history.push('/'))
        })
    }

    facebookLogin() {
        firebase.auth().signInWithPopup(facebookProvider).then((result: any) => {
            const { AuthAction, history, auth } = this.props;
            AuthAction.socialSign(
                'facebook',
                result.additionalUserInfo.profile.id,
                result.additionalUserInfo.profile.name,
                result.additionalUserInfo.profile.email,
                result.credential.accessToken,
                auth.fcmToken
            ).then(() => history.push('/'))
        })
    }

    kakaoLogin() {
        Kakao.Auth.createLoginButton({
            container: '#kakao-login-btn',
            success: (authObj: any) => {
                Kakao.API.request({
                    url: '/v2/user/me',
                    success: (user: any) => {
                        const { AuthAction, history, auth } = this.props;
                        // AuthAction.socialSign(
                        //     'kakao',
                        //     String(user.id),
                        //     user.properties.nickname,
                        //     user.properties.email,
                        //     authObj.access_token,
                        //     auth.fcmToken
                        // ).then(()=>history.push('/'))
                    },

                })
            },
            fail: (error) => {
                console.log(error);
            },

        })
        const elem: any = document.getElementById('kakao-login-btn');
        elem.click();
    }

    naverLogin() {
        window.addEventListener('message', (e: MessageEvent) => {
            if (e.data.type == 'naver_login') {
                const { AuthAction, history, auth } = this.props;
                AuthAction.socialSign(
                    'naver',
                    e.data.user.id,
                    e.data.user.name ? e.data.user.name : 'noname',
                    e.data.user.email,
                    e.data.access_token.accessToken,
                    auth.fcmToken
                ).then(() => history.push('/'))
            }
        })
        const elem: any = document.getElementById('naverIdLogin_loginButton')
        elem.click()
    }

    render() {
        return <div style={{ maxWidth: 500, margin: 'auto' }}>
            <div>
                <Button className="m-1 w-25" onClick={() => this.googleLogin()} color="danger">Google</Button>
                <Button className="m-1 w-25" onClick={() => this.facebookLogin()} color="info">Facebook</Button>
            </div>
            <div>
                <Button className="m-1 w-25" onClick={() => this.naverLogin()} color="success">Naver</Button>
                <Button className="m-1 w-25" onClick={() => this.kakaoLogin()} color="warning">Kakao</Button>
            </div>
            <div id="kakao-login-btn" style={{ display: 'none' }}></div>
        </div>
    }
}
export class NaverAuthCallbackComponent extends React.Component {

    componentDidMount() {
        const naverProvider = NaverProvider
        naverProvider.init();
        naverProvider.getLoginStatus((status: any) => {
            if (status) {
                window.opener.postMessage({
                    'type': 'naver_login',
                    'state': true,
                    'user': naverProvider.user,
                    'access_token': naverProvider.accessToken
                })
            } else {
                window.opener.postMessage({
                    'type': 'naver_login',
                    'state': false
                })
            }
            window.close();
        })
    }

    render() {
        return <div></div>
    }
}

export default connectWithoutDone(
    (state: RootState) => ({
        auth: state.auth
    }),
    (dispatch: Dispatch) => ({
        AuthAction: binding(AuthAction, dispatch)
    }),
    SocialLogin
)