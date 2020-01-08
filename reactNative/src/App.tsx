import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator  } from 'react-navigation-stack';
import { ThemeProvider } from 'react-native-elements';
import SplashScreen from './Splash';
import HomeScreen from './Home';
import SiginInScreen from './SignIn';
import SettingScreen from './Setting';
import TestScreen from './Test';
import { NotificationService } from './service/NotificationService';
import { BillingService } from './service/BillingService';
import { TaskService } from './service/TaskService';

const AppStack = createStackNavigator({
  Home:HomeScreen,
  Setting:SettingScreen,
  Test:TestScreen
})

const AuthStack = createStackNavigator({
  SignIn: SiginInScreen
})

const AppContainer = createAppContainer(
  createSwitchNavigator({
    Splash: SplashScreen,
    App:AppStack,
    Auth:AuthStack
  },{
    initialRouteName: 'Splash'
  })
);

const theme = {}

export default class AppScreen extends React.Component<any> {

  componentDidMount() {
    NotificationService.getInstance<NotificationService>()
    // BillingService.getInstance<BillingService>()
    // TaskService.getInstance<TaskService>()
  }

  componentWillUnmount() {
    NotificationService.getInstance<NotificationService>().destroy()
  }

  render() {
    return <ThemeProvider theme={theme}>
      <AppContainer />
    </ThemeProvider>
  }
}
