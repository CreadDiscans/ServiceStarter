
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Button, ThemeProvider } from 'react-native-elements';
import { NotificationService } from './service/NotificationService';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Test extends React.Component<Props> {

    render() {
        return <View>
            <Button title="send notification" onPress={()=> 
                NotificationService.getInstance<NotificationService>()
                .send('id', 'title', 'body', 'default', {'key':'value'})} />
        </View>
    }
}