import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { View, Image, Text } from 'react-native';
import { S } from '../core/S';
import { binding } from '../core/connection';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { AuthAction, init } from '../auth/Auth.action';

interface Props {
    // AuthAct:typeof AuthAction
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

function Splash(props:Props) {
    const auth = useSelector((state:any)=>state.auth)
    const dispatch = useDispatch()
    useEffect(()=> {
        dispatch(init())
    }, [])
    if ('profile' in auth) {
        props.navigation.navigate(auth.profile ? 'Home' : 'SignIn')
    }

    return <View style={S.center}>
        <Image source={require('../assets/logo.png')}/>
        <Text>loading...</Text>
    </View>
}
// class Splash extends React.Component<Props> {    

//     componentDidMount() {
//         const {AuthAct, navigation} = this.props
//         // AuthAct.init().then(res=> navigation.navigate(res.profile ? 'Home' : 'SignIn'))
//     }

//     render(){
//         return <View style={S.center}>
//             <Image source={require('../assets/logo.png')}/>
//             <Text>loading...</Text>
//         </View>
//     }
// }

export default Splash
// connect(
//     (state:RootState)=>({}),
//     (dispatch:Dispatch)=>({
//         AuthAct:binding(AuthAction, dispatch)
//     })
// )(Splash)