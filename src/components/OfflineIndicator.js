import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../style/styles";
import "../style/index.css";
import "../css/main.css";
import { windowOffline, windowOnline } from "../redux/actions/OfflineIndicatorAction";
import { connect } from "react-redux";
class OfflineIndicator extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      isOffline: false,
    };
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this)
  }

  componentDidMount(){
    window.addEventListener('online',  this.updateOnlineStatus);
  window.addEventListener('offline', this.updateOnlineStatus);
  }
  updateOnlineStatus(e) {
    if(e.type === 'offline')
      this.props.windowOffline()
    else 
    this.props.windowOnline()
  }

  render() {
    if(!navigator.onLine){
      this.updateOnlineStatus( new Event('offline') );
    }
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

const mapDispatchToProps = {
  windowOffline,
  windowOnline
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(OfflineIndicator));
