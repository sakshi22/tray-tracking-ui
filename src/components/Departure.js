import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchReadyToDepartCarts, openDepartedSummary, closeDepartedSummary, fetchAllServiceStylesAndKitchens, filterKitchenBySelectedServiceStyle, filterCarts } from '../redux/actions/DepartureAction';
import CustomCart from './carts/CustomCart';
import AppHeader from "./sharedComponents/AppHeader";
import FiltersComponent from "./sharedComponents/FiltersComponent";
import { DEPARTED, NO_CART_AVAILABLE, SERVICE_STYLE, SHOW_ALL_SERVICE_STYLES,
  SHOW_ALL_BUILD_AREAS, BUILD_AREA, SEARCH, NUMBER, SEARCH_LABEL_TRAY_NUMBERS } from '../redux/actions/Constants'
import CustomSearchBar from "./sharedComponents/CustomSearchBar";

class Departure extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedKitchenId: '-1',
      selectedServiceStyle: '-1',
      search:'',
      showClear: false
    }
    this.openDepartedSummary = this.openDepartedSummary.bind(this);
    this.closeDepartedSummary = this.closeDepartedSummary.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this)
  }

  componentWillMount() {
    this.props.fetchReadyToDepartCarts();
    this.props.fetchAllServiceStylesAndKitchens();
  }

  openDepartedSummary(cart)
  {     
    this.props.openDepartedSummary(cart, this.props.history, DEPARTED);   
  }

  closeDepartedSummary()
  { 
    this.props.closeDepartedSummary();       
  }

  clearSearch(){
    this.setState({showClear: false, search: ''})
    this.props.filterCarts(this.state.selectedServiceStyle, this.state.selectedKitchenId, '')
  }

  onChange(event){
    if (event.target.name === SERVICE_STYLE) {
     this.props.filterKitchenBySelectedServiceStyle(event.target.value);
     this.props.filterCarts(event.target.value, '-1', this.state.search)
     this.setState({selectedServiceStyle: event.target.value, selectedKitchenId: '-1'}) 
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
      {(this.props.loadingDepartureScreen || this.props.loading) && <div className="loader"><img alt="Loading. Please wait..." className="loading-gif" src={require("../images/loading.gif")}/></div>}
      <AppHeader props={this.props} title='Cart Departure'/>
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
        this.props.readyToDepartCarts && this.props.readyToDepartCarts.length > 0 ? 
        <span className="cart-box">
          <h4>Tap cart to view meal orders to mark as Departed</h4>
      {this.props.loading ? null : <CustomCart carts= {this.props.readyToDepartCarts} openSummary = {this.openDepartedSummary}/>} 
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
    readyToDepartCarts : state.departReducer.carts ,
    isOpen : state.departReducer.isOpen,
    loading: state.loader.loading,
    loadingDepartureScreen: state.loader.loadingDepartureScreen,
    isOffline: state.offlineIndicator.isOffline,
    serviceStyles: state.departReducer.serviceStyles,
    kitchens: state.departReducer.filteredKitchens,
  }
}
const mapDispatchToProps = {
  fetchReadyToDepartCarts,
  openDepartedSummary,
  closeDepartedSummary,
  fetchAllServiceStylesAndKitchens,
  filterKitchenBySelectedServiceStyle,
  filterCarts,
}
export default connect(mapStateToProps, mapDispatchToProps)(Departure);