import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator  } from 'react-navigation-stack';
import { ThemeProvider } from 'react-native-elements';
import Splash from '../home/Splash';
import Home from '../home/Home';
import SiginIn from '../home/SignIn';
import { Provider } from 'react-redux';
import { store } from './Store';

const AppStack = createStackNavigator({
  Home:Home,
  // Setting:SettingScreen,
  // Test:TestScreen
})

const AuthStack = createStackNavigator({
  SignIn: SiginIn
})

const AppContainer = createAppContainer(
  createSwitchNavigator({
    Splash: Splash,
    App:AppStack,
    Auth:AuthStack
  },{
    initialRouteName: 'Splash'
  })
);

const theme = {}

export default class AppScreen extends React.Component<any> {

  render() {
    return <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppContainer />
      </ThemeProvider>
    </Provider>
  }
}
