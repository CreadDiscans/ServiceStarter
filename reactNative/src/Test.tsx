
import React from 'react';
import { View, Platform } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { ApiService } from './service/ApiService';
import BackgroundTimer from 'react-native-background-timer';
interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Test extends React.Component<Props> {

    sendNotification() {
        const notification = new firebase.notifications.Notification()
        .setTitle('title')
        .setBody('body')
        .setNotificationId('id')
        .setSound('default')
        if (Platform.OS === 'android') {
            notification.android.setChannelId('default')
            notification.android.setPriority(firebase.notifications.Android.Priority.Max)
            const action = new firebase.notifications.Android.Action('test_action', 'ic_launcher', 'My Test Action')
            const remoteInput = new firebase.notifications.Android.RemoteInput('inputText')
            .setLabel('Message');
            action.addRemoteInput(remoteInput);
            notification.android.addAction(action);
        }
        firebase.notifications().displayNotification(notification)
    }

    sendFcm() {
        firebase.messaging().getToken().then(fcmToken => {
            if (fcmToken) {
                ApiService.getInstance<ApiService>().post('/fcm_test', {
                    token: fcmToken,
                    data: {
                        'key': 'value'
                    }
                }).then(res=> console.log(res))
            } else {
                console.log('no token')
            }
        })
    }

    signin() {
        ApiService.getInstance<ApiService>().signin('test1', 'test1')
        .then(res=> console.log(res))
        .catch(err=>console.log(err))
    }

    signup() {
        ApiService.getInstance<ApiService>().signup('test1', 'test1@test.com', 'test1')
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    }

    background() {
        if (Platform.OS === 'android') {
            BackgroundTimer.setTimeout(()=> {
                console.log('do in background')
            }, 3000)
        } else if (Platform.OS === 'ios') {
            BackgroundTimer.start();
            setTimeout(()=> {
                console.log('do in background')
            }, 3000)
            BackgroundTimer.stop();
        }
    }

    render() {
        return <View>
            <Button title="send notification" onPress={()=> this.sendNotification()} />
            <Button title="send fcm" onPress={()=> this.sendFcm()} /> 
            <Button title="signin" onPress={()=> this.signin()} />
            <Button title="signup" onPress={()=> this.signup()} />
            <Button title="background" onPress={()=> this.background()} />
        </View>
    }
}