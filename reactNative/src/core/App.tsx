import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator  } from 'react-navigation-stack';
import { ThemeProvider } from 'react-native-elements';
import Splash from '../home/Splash';
import Home from '../home/Home';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import { Provider } from 'react-redux';
import { store } from './Store';
import Setting from '../setting/Setting';
import './I18n'

const AppStack = createStackNavigator({
  Home:Home,
  Setting:Setting
})

const AuthStack = createStackNavigator({
  SignIn: SignIn,
  SignUp: SignUp
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
