
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Button, ThemeProvider } from 'react-native-elements';
import { NotificationService } from './service/NotificationService';
import firebase from 'react-native-firebase';

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
                fetch('http://localhost:8000/fcm_test', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: fcmToken,
                        data: {
                            'key': 'value'
                        }
                    })
                }).then(res=> console.log(res))
                .catch(err=> console.log(err))
            } else {
                console.log('no token')
            }
        })
    }

    render() {
        return <View>
            <Button title="send notification" onPress={()=> this.sendNotification()} />
            <Button title="send fcm" onPress={()=> this.sendFcm()} /> 
        </View>
    }
}