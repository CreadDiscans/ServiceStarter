import { getHandleActions } from "app/core/connection"

export type SharedState = {
    alert?: {
        title:string
        content:string
        onConfirm?:Function
        onCancel?:Function
    }
}

const initState:SharedState = {

}

export const SharedAction = {
    alert:async(alert:SharedState['alert'])=> {
        return Promise.resolve({alert})
    }
}

export default getHandleActions(SharedAction, initState)