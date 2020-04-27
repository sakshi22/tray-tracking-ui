import React, { Component } from "react";
import OrderListButton from "./sharedComponents/OrderListButton";
import { RECOVERED_SCREEN_NAME } from "../redux/actions/Constants";
import { connect } from 'react-redux';

class Recovered extends Component {
  render() {

    return (
      <OrderListButton
        parentProps={this.props}
        screenName={RECOVERED_SCREEN_NAME}
        isRecovered={true}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isOffline: state.offlineIndicator.isOffline,
  }
}
export default connect(mapStateToProps, null)(Recovered);
