import firebase from 'react-native-firebase';
import { RemoteMessage } from 'react-native-firebase/messaging';

export default async (message: RemoteMessage) => {
    console.log(message)
    return Promise.resolve() // must return a promise and resolve within 60 seconds.
}