
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams, withNavigation, NavigationActions } from 'react-navigation';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Home extends React.Component<Props> {

    render() {
        return <View>
            <Text>home</Text>
        </View>
    }
}