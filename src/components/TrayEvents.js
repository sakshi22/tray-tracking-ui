import React, { Component } from "react";
import { connect } from 'react-redux';
import AppHeader from "./sharedComponents/AppHeader";
import { goToInCart, openReadyToDepart, openReadyToDeliver, openRecovered, goToUnitDeliveryTracking, goToUnitRecoveryTracking, openReadyToHighRiskTrayCheck } from '../redux/actions/TrayEventsAction';
import { INCART_SCREEN_NAME, DEPARTED_SCREEN_NAME, HIGH_RISK_TRAY_CHECK_SCREEN_NAME,
  DELIVERED_SCREEN_NAME, RECOVERED_SCREEN_NAME, UNIT_DELIVERY_TRACKING, 
  UNIT_RECOVERY_TRACKING } from "../redux/actions/Constants";
class TrayEvents extends Component {
  constructor(props) {
    super(props);
    this.openInCart = this.openInCart.bind(this);
    this.openReadyToDepart = this.openReadyToDepart.bind(this);
    this.openRecovered = this.openRecovered.bind(this);
    this.openReadyToHighRiskTrayCheck = this.openReadyToHighRiskTrayCheck.bind(this);
    this.openUnitDeliveryTracking = this.openUnitDeliveryTracking.bind(this);
    this.openUnitRecoveryTracking = this.openUnitRecoveryTracking.bind(this);
  }
  
  openInCart = () => {
    this.props.goToInCart(this.props.history);
  };

  openReadyToHighRiskTrayCheck = () => {
    this.props.openReadyToHighRiskTrayCheck(this.props.history);
  }

  openReadyToDepart = () => {
    this.props.openReadyToDepart(this.props.history);
  }

  openReadyToDeliver = () => {
    this.props.openReadyToDeliver(this.props.history);
  }

  openRecovered = () => {
    this.props.openRecovered(this.props.history);
  };

  openUnitDeliveryTracking = () => {
    this.props.goToUnitDeliveryTracking(this.props.history);
  };

  openUnitRecoveryTracking = () => {
    this.props.goToUnitRecoveryTracking(this.props.history);
  };

  render() {
    return (
      <div className="container">
        <AppHeader title='Tray Event Capture' showHomeLogo={false} props={this.props}/>
      <div className="box-outer">
        <div className="box-outer-inner">

          <div onClick={this.openInCart} className="bg-red">

            <img style={{height:'65px', width:'75px'}} alt="In Cart" src={require("../images/in-cart-icon.png")} />
            <h3> {INCART_SCREEN_NAME} </h3>

          </div>
          <div className="bg-neon" onClick={this.openReadyToHighRiskTrayCheck}>
            <img style={{height:'65px', width:'75px'}} alt="High Risk" src={require("../images/high-risk-icon.png")} />
            <h3> {HIGH_RISK_TRAY_CHECK_SCREEN_NAME} </h3>
          </div>
          <div className="bg-blue" onClick={this.openReadyToDepart}>
            <img style={{height:'65px', width:'75px'}} alt="Departed" src={require("../images/departed-icon.png")} />
            <h3> {DEPARTED_SCREEN_NAME} </h3>
          </div>
          <div className="bg-org" onClick={this.openReadyToDeliver}>
            <img style={{height:'65px', width:'75px'}} alt="Delivered" src={require("../images/delivered-icon.png")} />
            <h3> {DELIVERED_SCREEN_NAME} </h3>
          </div>
          <div className="bg-green"  onClick={this.openRecovered}>
            <img style={{height:'65px', width:'75px'}} alt="Recovered" src={require("../images/recovered-icon.png")} />
            <h3> {RECOVERED_SCREEN_NAME} </h3>
          </div>
        </div>

        <div className="box-outer-inner-unit text-right">
          <div onClick={this.openUnitDeliveryTracking} className="bg-org">

            <img style={{height:'65px', width:'75px'}} alt={UNIT_DELIVERY_TRACKING} src={require("../images/unit-delivery-icon.png")} />
            <h3> {UNIT_DELIVERY_TRACKING} </h3>

          </div>
          <div onClick={this.openUnitRecoveryTracking} className="bg-green">

            <img style={{height:'65px', width:'75px'}} alt={UNIT_RECOVERY_TRACKING} src={require("../images/unit-recovery-icon.png")} />
            <h3> {UNIT_RECOVERY_TRACKING} </h3>

          </div>

        </div>
      </div> 
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isOffline: state.offlineIndicator.isOffline,
  }
}

const mapDispatchToProps = {
  goToInCart,
  openReadyToDepart,
  openReadyToDeliver,
  openRecovered,
  openReadyToHighRiskTrayCheck,
  goToUnitDeliveryTracking,
  goToUnitRecoveryTracking
}
export default connect(mapStateToProps, mapDispatchToProps)(TrayEvents);