import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator  } from 'react-navigation-stack';
import SplashScreen from './Splash';
import HomeScreen from './Home';
import SiginInScreen from './SignIn';

const AppStack = createStackNavigator({
  Home:HomeScreen
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

export default class AppScreen extends React.Component<any> {
  render() {
    return <AppContainer />;
  }
}
