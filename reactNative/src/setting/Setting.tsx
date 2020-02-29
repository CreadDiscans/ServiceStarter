import React from 'react';
import { View } from 'react-native';
import { RootState } from '../core/Reducer';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { ListItem } from 'react-native-elements';
import { binding } from '../core/connection';
import { AuthAction } from '../auth/Auth.action';

interface Props {
    AuthAct: typeof AuthAction
}

class Setting extends React.Component<Props> {
    
    render() {
        return <View>
            <ListItem title={'로그아웃'} 
                chevron
                onPress={()=>this.props.AuthAct.signOut()}/>
        </View>
    }
}

export default connect(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    })
)(Setting)