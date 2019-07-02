import { withDone } from "react-router-server";
import { connect } from "react-redux";
import { withRouter } from "react-router";

export const connectWithDone:any = (mapStateToProps:any, mapDispatchToProps:any, compnent:any) => {
  const conn:any = connect(mapStateToProps, mapDispatchToProps)(withRouter(compnent))
  return withDone(conn);
}

export const connectWithoutDone:any = (mapStateToProps:any, mapDispatchToProps:any, compnent:any) => {
  const conn:any = connect(mapStateToProps, mapDispatchToProps)(compnent)
  return withRouter(conn);
}
