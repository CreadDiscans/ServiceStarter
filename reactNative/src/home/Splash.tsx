import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { View, Image, Text } from 'react-native';
import { S } from '../core/S';
import { binding } from '../core/connection';
import { HomeAction, HomeState } from './Home.action';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';

interface Props {
    home:HomeState
    HomeAct:typeof HomeAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

class Splash extends React.Component<Props> {    

    componentDidMount() {
        const {HomeAct} = this.props
        HomeAct.initialize().then(res=>{
            console.log(res.profile ? 'Home' : 'SignIn')
            this.props.navigation.navigate(res.profile ? 'Home' : 'SignIn');
        })
    }

    render(){
        return <View style={S.center}>
            <Image source={require('../assets/logo.png')}/>
            <Text>loading...</Text>
        </View>
    }
}

export default connect(
    (state:RootState)=>({
        home:state.home
    }),
    (dispatch:Dispatch)=>({
        HomeAct:binding(HomeAction, dispatch)
    })
)(Splash)