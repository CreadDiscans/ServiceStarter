import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

class Fcm extends React.Component<Props> {

    componentDidMount() {
        
    }

    render() {
        return <View></View>
    }
}

export default connect(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({})
)(Fcm)
