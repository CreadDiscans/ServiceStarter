import { Singletone } from "./Singletone";
import firebase from "react-native-firebase";
import { Platform } from "react-native";

export class NotificationService extends Singletone<NotificationService>{

    removeNotificationDisplayedListener:any;
    removeNotificationListener:any;
    removeNotificationOpenedListener:any;

    init() {
        firebase.messaging().hasPermission().then(enable=> {
            if (enable) {
                this.onNotification() 
            } else {
                firebase.messaging().requestPermission().then(()=> {
                    this.onNotification() 
                }).catch(error=> {
                    console.log(error)
                })
            }
        })   
    }

    createChannel(id:string, name:string, desc:string) {
        if (Platform.OS === 'android') {
            const channel = new firebase.notifications.Android.Channel(id, name, firebase.notifications.Android.Importance.Max)
            .setDescription(desc)

            firebase.notifications().android.createChannel(channel)
        }
    }

    onNotification() {
        this.createChannel('default', 'default', 'default')
        // local notification
        this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed(notification=> {
            console.log(notification)
        })
        // fcm notification + foreground
        this.removeNotificationListener = firebase.notifications().onNotification(notification=> {
            console.log(notification)
        })
        // notification action + foreground
        this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened(notification=> {
            console.log(notification)
        })
    }

    send(id:string, title:string='', body:string='', channel:string='default', data:any=null) {
        const notification = new firebase.notifications.Notification()
        .setNotificationId(id)
        .setTitle(title)
        .setBody(body)
        if (data) {
            notification.setData(data)
        }
        if (Platform.OS === 'ios') {

        } else if (Platform.OS === 'android') {
            notification.android.setChannelId(channel)
            // notification.android.setSmallIcon('ic_launcher')
        }
        firebase.notifications().displayNotification(notification);
    }

    destroy() {
        if(this.removeNotificationDisplayedListener) {
            this.removeNotificationDisplayedListener()
        }
        if(this.removeNotificationListener) {
            this.removeNotificationListener()
        }
    }
}