import { Singletone } from "./Singletone";
import firebase from "react-native-firebase";
import { Platform } from "react-native";
import { RemoteMessage } from "react-native-firebase/messaging";

export const BackgroundMessaging = async(message: RemoteMessage) => {
    console.log(message)
    return Promise.resolve() // must return a promise and resolve within 60 seconds.
}
export class NotificationService extends Singletone<NotificationService>{

    removeNotificationDisplayedListener:any;
    removeNotificationListener:any;
    removeNotificationOpenedListener:any;
    removeTokenRefreshListener:any;
    removeMessageListener:any;

    constructor() {
        super()
        this.init()
    }

    private init() {
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
        this.removeTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken=> {
            console.log(fcmToken)
        })
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
        this.removeMessageListener = firebase.messaging().onMessage(message=> {
            console.log(message)
        })
    }

    destroy() {
        if(this.removeNotificationDisplayedListener) {
            this.removeNotificationDisplayedListener()
        }
        if(this.removeNotificationListener) {
            this.removeNotificationListener()
        }
        if(this.removeNotificationOpenedListener) {
            this.removeNotificationOpenedListener()
        }
        if (this.removeTokenRefreshListener) {
            this.removeTokenRefreshListener()
        }
        if(this.removeMessageListener) {
            this.removeMessageListener()
        }
    }
}