import { createAction, handleActions } from "redux-actions";
import { pender } from "redux-pender";
import { bindActionCreators, Dispatch } from "redux";
import { withTranslation } from 'react-i18next'
import { RootState } from "./Reducer";
import { connect } from 'react-redux';

const getActions = (Action:any) => {
  const actions:any = {}
  Object.keys(Action).filter(k=>k!=='name').forEach(key=> 
      actions[key] = createAction(key, Action[key]))
  return actions
}

export const getHandleActions = (Action:any, initState:any) => {
  const arr =  Object.keys(Action).filter(k=>k!=='name').map(key=>
      pender({
          type:key,
          onSuccess:(state:any, {payload})=>({...state, ...payload})
      })
  )
  const result:any = {}
  arr.forEach(p=> Object.keys(p).forEach(k=>result[k]=p[k]))
  return handleActions(result, initState)
}

export const binding = (Action:any, dispatch:Dispatch) => {
  return bindActionCreators(getActions(Action), dispatch)
}

export const chain = (
  stateFunc:(state:RootState)=>({}), 
  dispatchFnc:(dispatch:Dispatch)=>({}), 
  comp:React.ComponentType<any>
) => connect(stateFunc, dispatchFnc)(withTranslation()(comp))

