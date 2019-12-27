
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Button, ThemeProvider } from 'react-native-elements';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Home extends React.Component<Props> {

    render() {
        return <Button title="Hey!" />
    }
}