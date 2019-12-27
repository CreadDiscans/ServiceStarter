import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class SignIn extends React.Component<Props> {
    
    _signInAsync = async() => {
        await AsyncStorage.setItem('userToken', 'token');
        this.props.navigation.navigate('Home')
    }
    
    render() {
        return <View style={styles.container}>
            <Button title="Sign In" onPress={this._signInAsync} />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})