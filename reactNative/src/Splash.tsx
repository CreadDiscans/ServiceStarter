import React from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams, withNavigation, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Splash extends React.Component<Props> {

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async() => {
        const userToken = await AsyncStorage.getItem('userToken');
        this.props.navigation.navigate(userToken ? 'Home' : 'SignIn');
    }

    render() {
        return <View style={styles.container}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})