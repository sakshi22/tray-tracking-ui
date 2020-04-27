import React, { Component } from "react";
import { connect } from 'react-redux';
import { DEPARTED, DELIVERED_SCREEN_NAME, DEPARTED_SCREEN_NAME, HIGH_RISK_TRAY_CHECK, HIGH_RISK_TRAY_CHECK_SCREEN_NAME } from '../redux/actions/Constants';
import OrderListButton from "./sharedComponents/OrderListButton";

class DepartedCart extends Component {

  render() {
    var isDeparted = this.props.selectedScreen === DEPARTED;
    var isHighRiskTrayCheck = this.props.selectedScreen === HIGH_RISK_TRAY_CHECK; 
    return(
      <OrderListButton 
        parentProps={this.props}
        screenName={isDeparted ? DEPARTED_SCREEN_NAME : isHighRiskTrayCheck ? HIGH_RISK_TRAY_CHECK_SCREEN_NAME : DELIVERED_SCREEN_NAME}
      showBack={true}
      isDeparted={isDeparted && !isHighRiskTrayCheck}
      isHighRiskTrayCheck={isHighRiskTrayCheck && !isDeparted}
      isDelivered={!isDeparted && !isHighRiskTrayCheck}
      selectedCart={this.props.selectedCart}
      />
    )
  }
}


const mapStateToProps = state => {
  return {
    selectedCart: state.departReducer.selectedCart,
    selectedScreen: state.departReducer.selectedScreen,
    isOffline: state.offlineIndicator.isOffline,
  }
}
export default connect(mapStateToProps, null)(DepartedCart);
