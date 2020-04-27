import React, { Component } from "react";
import { connect } from 'react-redux';
import AppHeader from "./sharedComponents/AppHeader";
import CustomCart from './carts/CustomCart';
import { HIGH_RISK_TRAY_CHECK, NO_CART_AVAILABLE, SERVICE_STYLE, SHOW_ALL_SERVICE_STYLES,
  SHOW_ALL_BUILD_AREAS, BUILD_AREA, SEARCH, NUMBER, SEARCH_LABEL_TRAY_NUMBERS, HIGH_RISK_TRAY_CHECK_SCREEN_NAME  } from '../redux/actions/Constants';
import { openDepartedSummary, fetchAllServiceStylesAndKitchens, filterKitchenBySelectedServiceStyle } from '../redux/actions/DepartureAction';
import { fetchReadyToHighRiskCheckCarts,  
	filterCarts } from '../redux/actions/HighRiskTrayCheckAction';	
import FiltersComponent from "./sharedComponents/FiltersComponent";
import CustomSearchBar from "./sharedComponents/CustomSearchBar";

class HighRiskTrayCheck extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedKitchenId: '-1',
      selectedServiceStyle: '-1',
      search:'',
      showClear: false
    }
    this.onChange = this.onChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.openHighRiskTrayCheckSummary = this.openHighRiskTrayCheckSummary.bind(this);
  }

  componentWillMount() {
	this.props.fetchAllServiceStylesAndKitchens();
    this.props.fetchReadyToHighRiskCheckCarts();
  }

  openHighRiskTrayCheckSummary(cart)
  {  
    this.props.openDepartedSummary(cart, this.props.history, HIGH_RISK_TRAY_CHECK);   
  }
  
  clearSearch(){
    this.setState({showClear: false, search: ''})
    this.props.filterCarts(this.state.selectedServiceStyle, this.state.selectedKitchenId, '')
  }

  onChange(event) {
	 if (event.target.name === SERVICE_STYLE) {
	  this.props.filterKitchenBySelectedServiceStyle(event.target.value);
	  this.props.filterCarts(event.target.value, '-1', this.state.search);
	  this.setState({selectedServiceStyle: event.target.value, selectedKitchenId: '-1'});
	}
    else if (event.target.name === BUILD_AREA) {
      this.props.filterCarts(this.state.selectedServiceStyle, event.target.value, this.state.search)
      this.setState({selectedKitchenId: event.target.value})
    } else if (event.target.name === SEARCH){
      var value = event.target.value.replace(/[^0-9]/g, '');
      this.setState({ [event.target.name] : value, showClear: value !== ''});
      this.props.filterCarts(this.state.selectedServiceStyle, this.state.selectedKitchenId, value)
    }
  }

render() {
	var filters = [
	    { name: SERVICE_STYLE, value: this.state.selectedServiceStyle, default: SHOW_ALL_SERVICE_STYLES, optionArray: this.props.serviceStyles, showDefault: (this.props.serviceStyles && this.props.serviceStyles.length > 1), class: 'service-style-filter' },
	    { name: BUILD_AREA, value: this.state.selectedKitchenId, default: SHOW_ALL_BUILD_AREAS, optionArray: this.props.kitchens, class: 'service-style-filter' },
	   ]
  return (

    <div className="container">
      {this.props.loading && <div className="loader"><img alt="Loading. Please wait..." className="loading-gif" src={require("../images/loading.gif")} /></div>}
      <AppHeader props={this.props} title={HIGH_RISK_TRAY_CHECK_SCREEN_NAME} />
    	  <div style={{ marginLeft: '-10px' }}>
      <div style={{float:'left', position:'relative'}}>
      <FiltersComponent menuClass="select-menu-incart" filters={filters} onChange={(e) => this.onChange(e)} />
      </div>
      <div style={{float:'left'}}>
      <CustomSearchBar 
	      placeholder = {SEARCH_LABEL_TRAY_NUMBERS}
	      class = "search-custom-bar-depart"
	      display = {this.state.showClear}
	      onChange = {this.onChange}
	      clearSearch = {this.clearSearch}
	      name = {SEARCH}
	      value={this.state.search}
	      type={NUMBER}
          maxLength="5"
	      />
      </div>  
    </div>
      <div className="margin-top-50 content-outer">
        {
          this.props.readyToHighRiskTrayCheckCarts && this.props.readyToHighRiskTrayCheckCarts.length > 0 ?
            <span className="cart-box">
              <h4>Tap cart to view meal orders for High Risk Tray Check</h4>
              {this.props.loading ? null : <CustomCart carts={this.props.readyToHighRiskTrayCheckCarts} openSummary={this.openHighRiskTrayCheckSummary} />}
            </span>
            :
            <span className="cart-box">
              <h4>{NO_CART_AVAILABLE}</h4>
            </span>
        }
      </div>
    </div>
  );
}
}

const mapStateToProps = state => {
  return {
    loading: state.loader.loading,
    isOffline: state.offlineIndicator.isOffline,
    readyToHighRiskTrayCheckCarts : state.highRiskTrayCheckReducer.carts,
    serviceStyles: state.departReducer.serviceStyles,
    kitchens: state.departReducer.filteredKitchens,
  }
}
const mapDispatchToProps = {
  fetchReadyToHighRiskCheckCarts,
  openDepartedSummary,
  fetchAllServiceStylesAndKitchens,
  filterKitchenBySelectedServiceStyle,
  filterCarts,
}
export default connect(mapStateToProps, mapDispatchToProps)(HighRiskTrayCheck);