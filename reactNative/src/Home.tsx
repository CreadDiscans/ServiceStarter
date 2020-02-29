
import React from 'react';
import { View } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Button } from 'react-native-elements';
import { Header } from '../src/components/Header';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Home extends React.Component<Props> {


    render() {
        return <View>
            <Button title="Test" onPress={()=>this.props.navigation.navigate('Test')} />
            <Button title="Setting" onPress={()=>this.props.navigation.navigate('Setting')}/>
        </View>
    }
}