import { withDone } from "react-router-server";
import { connect } from "react-redux";

const connectWithDone:any = (mapStateToProps:any, mapDispatchToProps:any, compnent:any) => {
  const conn:any = connect(mapStateToProps, mapDispatchToProps)(compnent)
  return withDone(conn);
}

export default connectWithDone