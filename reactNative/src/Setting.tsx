
import React from 'react';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Setting extends React.Component<Props> {

    render() {
        return <View>
            <ListItem 
                title={'Version ' + DeviceInfo.getVersion()}
            />
            <ListItem title={'Logout'} onPress={async()=> {
                await AsyncStorage.removeItem('userToken')
                this.props.navigation.navigate('SignIn')
            }} />
        </View>
    }
}