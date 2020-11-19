import { withDone } from "react-router-server";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createAction, handleActions } from "redux-actions";
import { pender } from "redux-pender";
import { bindActionCreators, Dispatch } from "redux";

export const connectWithDone:any = (mapStateToProps:any, mapDispatchToProps:any, compnent:any) => {
  const conn:any = withRouter(connect(mapStateToProps, mapDispatchToProps)(compnent))
  return withDone(conn);
}

export const connectWithoutDone:any = (mapStateToProps:any, mapDispatchToProps:any, compnent:any) => {
  const conn:any = connect(mapStateToProps, mapDispatchToProps)(compnent)
  return withRouter(conn);
}

const getActions = (Action:any) => {
  const actions:any = {}
  Object.keys(Action).forEach(key=> 
      actions[key] = createAction(key, Action[key]))
  return actions
}

export const getHandleActions = (Action:any, initState:any) => {
  const arr =  Object.keys(Action).map(key=>
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