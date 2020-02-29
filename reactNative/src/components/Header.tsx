import React from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { S } from '../core/S';
import { Icon } from 'react-native-elements';

export class Header {
    static homeHeader(title:string, onPress:Function):any {
        return {
            header:()=><View style={{padding:15,
                    display:'flex', 
                    flexDirection:'row',
                    justifyContent:'space-between',
                    borderBottomWidth:1,
                    borderBottomColor:'#ccc',
                    marginBottom:5,
                    backgroundColor:'white'
                }}>
                <View>
                    <Text style={{fontSize:20}}>{title}</Text>
                </View>
                <TouchableOpacity onPress={()=>onPress()}>
                    <Icon name="cog" type="font-awesome"></Icon>
                </TouchableOpacity>
            </View>
        }
    }
    
    static invisableHeader():any {
        return {
            header:()=> <View></View>
        }
    }   
}