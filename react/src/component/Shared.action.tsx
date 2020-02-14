import { getHandleActions } from "app/core/connection"

export type SharedState = {
    alert?: {
        title:string
        content:string
        onConfirm?:Function
        onCancel?:Function
    },
    notification?: {
        content:string
        onClick?:Function
    }
}

const initState:SharedState = {

}

export const SharedAction = {
    alert:async(alert:SharedState['alert'])=> {
        return Promise.resolve({alert})
    },
    notify:async(notification:SharedState['notification'])=>{
        return Promise.resolve({notification})
    }
}

export default getHandleActions(SharedAction, initState)