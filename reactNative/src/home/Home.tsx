
import React from 'react';
import { View } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Button } from 'react-native-elements';
import { Header } from '../components/Header';
import Fcm from '../components/Fcm';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Home extends React.Component<Props> {
    static navigationOptions = ({navigation}:any)=>Header.homeHeader('Home', ()=> navigation.navigate('Setting'))

    render() {
        return <View>
            <Button title="Test" onPress={()=>this.props.navigation.navigate('Test')} />
            <Button title="Setting" onPress={()=>this.props.navigation.navigate('Setting')}/>
            <Fcm navigation={this.props.navigation}/>
        </View>
    }
}