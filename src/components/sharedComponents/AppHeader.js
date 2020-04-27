import React, { Component } from "react";
import { connect } from 'react-redux';
import Dropdown from './Dropdown';
import { logOut } from '../../redux/actions/LoginAction';
import { goToTrayEvents } from '../../redux/actions/TrayEventsAction';
import { DEPARTED, DELIVERED, CART_SUMMARY, ERROR_WHILE_OFFLINE_SWITCHING_FACILITY, ERROR_WHILE_OFFLINE_SWITCHING_FACILITY_TITLE, OFFLINE_MODE_ON_MESSAGE, HIGH_RISK_TRAY_CHECK } from '../../redux/actions/Constants';
import { switchFacility, saveDafaultFacility, handleClose } from '../../redux/actions/DropDownAction';
import FacilityPopup from '../FacilityPopup';
import CustomizedDialog from '../sharedComponents/CustomizedDialogs';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.goToTrayEvents = this.goToTrayEvents.bind(this);
    this.goToPreviousScreen = this.goToPreviousScreen.bind(this);
    this.switchFacility = this.switchFacility.bind(this);
    this.saveDafaultFacility = this.saveDafaultFacility.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  goToTrayEvents = () => {
    this.props.goToTrayEvents(this.props.props.history)
  }

  handleLogOut = () => {
    this.props.logOut(this.props.props.history);
  }

  switchFacility = () => {
    this.props.switchFacility(this.props.isOffline);
  }

  saveDafaultFacility = (facility) => {
    this.props.saveDafaultFacility(facility, this.props.props.history);
  }

   handleClose() {
    this.props.handleClose();
  }

  goToPreviousScreen= () => {
    if(this.props.props.selectedScreen === DEPARTED)
    {
      this.props.props.history.push('/departure');
    }
    else if(this.props.props.selectedScreen === DELIVERED){
      this.props.props.history.push('/delivered');
    }
    else if(this.props.props.selectedScreen === CART_SUMMARY){
      this.props.props.history.push('/inCart');
    }
    else if(this.props.props.selectedScreen === HIGH_RISK_TRAY_CHECK){
      this.props.props.history.push('/highRiskTrayCheck');
    }
  }

  render() {
    const offlineFacilityPopupMessage = <div style={{margin: '27px'}}>{ERROR_WHILE_OFFLINE_SWITCHING_FACILITY}</div>
    return (

      

    <header>

      {this.props.showBack &&
        <button onClick={this.goToPreviousScreen}
                className="back_button">
	        <ArrowBackIosIcon style={{color: "white",fontSize: "35px", position: 'relative', left: '5.5px', top: '1px'}} />
        </button> 
      }
  
      <div className={this.props.showBack ? "logo logo-margin-left logo-float-left" : "logo logo-float-left"}>
        {this.props.showHomeLogo ?  
        <img className="home-logo" alt="home" onClick={this.goToTrayEvents} src={require("../../images/logo_home.png" )} /> : null} 
        <h1 style={{left: this.props.showHomeLogo ? '75px': '17px'}} className={this.props.showBack ? "header-margin-left" : ""} ><b>{this.props.title}</b></h1>
      </div>



      <div className="logo" >
        <img alt="mydining" src={require("../../images/logo.svg" )} />   
      </div>
      {this.props.isOffline && <div style={{marginTop: '-27px', background: '#d2cece', paddingLeft: '82px', color: '#676565'}}>
        <span> {OFFLINE_MODE_ON_MESSAGE} </span>
      </div>}
      <Dropdown logOut={this.handleLogOut} switchFacility ={this.switchFacility} selectedFacilityName={this.props.selectedFacilityName}/>
      <CustomizedDialog open={this.props.showFacilityPopup} handleClose={this.handleClose} 
      customClassName="change-facility"
        dialogContent={<ul className="facility-popup-ul">
        <FacilityPopup facilities={this.props.allFacilities} saveDafaultFacility={this.saveDafaultFacility}
        selectedFacilityId={this.props.selectedFacilityId}/></ul>}
          dialogTitle="Change Facility"/>
        <CustomizedDialog open={this.props.showOfflineFacilityPopup} handleClose={this.handleClose} 
        dialogContent={offlineFacilityPopupMessage} 
          dialogTitle={ERROR_WHILE_OFFLINE_SWITCHING_FACILITY_TITLE}/> 
    </header>
    );
  }
}
AppHeader.defaultProps = {
  title: "Tray Event Capture",
  showHomeLogo: true,
};

const mapStatetoProps = (state) => {
  return {
    allFacilities: state.dropDown.allFacilities,
    showFacilityPopup : state.dropDown.showFacilityPopup,
    showOfflineFacilityPopup : state.dropDown.showOfflineFacilityPopup,
    selectedFacilityId: state.dropDown.selectedFacilityId,
    selectedFacilityName: state.login.defaultFacilityName,
    loading: state.loader.loading,
    isOffline: state.offlineIndicator.isOffline,
  }
}

const mapDispatchToProps ={
    logOut,
    goToTrayEvents,
    saveDafaultFacility,
    switchFacility,
    handleClose
}

export default connect(mapStatetoProps, mapDispatchToProps)(AppHeader);