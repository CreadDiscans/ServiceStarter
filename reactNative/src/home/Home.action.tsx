import { getHandleActions } from "../core/connection"
import AsyncStorage from "@react-native-community/async-storage";
import * as ApiType from '../types/api.types';

export type HomeState = {
    profile?:ApiType.Profile
}

const initState = {

}

export const HomeAction = {
    initialize:async()=> {
        const profile = await AsyncStorage.getItem('profile');
        return Promise.resolve({profile})
    }
}

export default getHandleActions(HomeAction, initState)