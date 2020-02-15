/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/core/App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {BackgroundMessaging} from './src/service/NotificationService';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', ()=> BackgroundMessaging)