import React from 'react';
import { View } from 'react-native';
import { RootState } from '../core/Reducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ListItem } from 'react-native-elements';
import { binding } from '../core/connection';
import { AuthAction } from '../auth/Auth.action';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';

interface Props {
    AuthAct: typeof AuthAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

class Setting extends React.Component<Props> {
    
    render() {
        return <View>
            <ListItem title={'로그아웃'} 
                chevron
                onPress={()=>{
                    this.props.AuthAct.signOut()
                    this.props.navigation.navigate('SignIn')
                }}/>
        </View>
    }
}

export default connect(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    })
)(Setting)