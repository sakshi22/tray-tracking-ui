import React, { Component } from "react";
import { connect } from 'react-redux';
import AppHeader from "./sharedComponents/AppHeader";
import { addOrderToCompletedCart } from '../redux/actions/DepartureAction'
import { fetchAllServiceStylesForSelectedFacility, fetchAllKitchensForSelectedFacility, fetchOutCartOrders, selectMealOrder, fetchCarts, addOrderToCart, fetchAllUnitsForSelectedKitchen, markCartAsComplete, removeTrayFromCart, unselectMealOrder, openInCartSummary, closeAlertMessage, updateSelectedSortBy, fetchFacilityMealNameArrayForSelectedFacility, updateSelectedMealName, updateSelectedServiceStyle, updateSelectedKitchen, updateSelectedUnit, filterOutCartOrders } from '../redux/actions/InCartAction';
import Cart from "./sharedComponents/Cart";
import OrderTicketList from "./sharedComponents/OrderTicketList";
import FiltersComponent from "./sharedComponents/FiltersComponent";
import { INCART_SCREEN_NAME, NO_MORE_TRAYS, SHOW_ALL_SERVICE_STYLES, SHOW_ALL_BUILD_AREAS, SHOW_ALL_UNITS, UNIT, BUILD_AREA, SERVICE_STYLE, CART_SUMMARY, ERROR_WHILE_ADDING_MEAL_ORDERS, OFFLINE_MODE_ON_MESSAGE, LOAD_NEW_TRAYS, INCART_SORT_BY_OPTION_ARRAY, SORT_BY, MEAL_NAME, SEARCH, SEARCH_LABEL } from "../redux/actions/Constants";
import CustomizedDialogs from "./sharedComponents/CustomizedDialogs";
import CustomSearchBar from "./sharedComponents/CustomSearchBar";

class InCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRefreshBtn: true,
      showRefreshLoading: false,
      mealOrderSelected: false,
      isInCart: this.props.screenName === INCART_SCREEN_NAME,
      enableLoader: true,
      search:'',
      showClear: false
    }
    this.returnSelectedOrder = this.returnSelectedOrder.bind(this);
    this.returnSelectedCart = this.returnSelectedCart.bind(this);
    this.markCartAsComplete = this.markCartAsComplete.bind(this);
    this.removeTray = this.removeTray.bind(this);
    this.addTraysBackToOutCart = this.addTraysBackToOutCart.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickRefresh = this.onClickRefresh.bind(this);
    this.refreshMealOrders = this.refreshMealOrders.bind(this);
    this.addTray = this.addTray.bind(this)
    this.openInCartSummary = this.openInCartSummary.bind(this);
    this.closeAlertMessage = this.closeAlertMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.clearSearch = this.clearSearch.bind(this)
  }
  clearSearch(){
    this.setState({showClear: false, search: ''})
    this.props.filterOutCartOrders('')
  }
  handleClose() {
        this.props.handleClose()
    };
  componentWillMount() {
    if (this.state.isInCart){
      this.props.fetchCarts()
    }
    this.props.fetchAllServiceStylesForSelectedFacility()
    this.props.fetchAllKitchensForSelectedFacility(this.props.selectedServiceStyle)
    this.props.fetchAllUnitsForSelectedKitchen(this.props.selectedServiceStyle, this.props.selectedKitchen)
    this.props.fetchOutCartOrders(this.props.selectedServiceStyle, this.props.selectedKitchen, this.props.selectedUnit, this.props.selectedMealName, this.state.search)
    this.props.fetchFacilityMealNameArrayForSelectedFacility();
  }
  getSelectedServiceStyle(serviceStyles) {
    if (serviceStyles.length > 1) {
      return -1
    } else {
      return serviceStyles[0].id;
    }
  }
  onChange(event) {
    if (event.target.name === SERVICE_STYLE) {
      this.props.updateSelectedServiceStyle(event.target.value);
      this.props.updateSelectedKitchen(-1);
      this.props.updateSelectedUnit(-1)
      this.props.fetchAllKitchensForSelectedFacility(event.target.value)
      this.props.fetchAllUnitsForSelectedKitchen(event.target.value, -1)
      this.props.fetchOutCartOrders(event.target.value, -1, -1, this.props.selectedMealName, this.state.search)
    }
    else if (event.target.name === BUILD_AREA) {
      this.props.updateSelectedKitchen(event.target.value);
      this.props.updateSelectedUnit(-1)
      this.props.fetchAllUnitsForSelectedKitchen(this.props.selectedServiceStyle, event.target.value)
      this.props.fetchOutCartOrders(this.props.selectedServiceStyle, event.target.value, -1, this.props.selectedMealName, this.state.search);
    } else if (event.target.name === UNIT) {
      this.props.updateSelectedUnit(event.target.value)
      this.props.fetchOutCartOrders(this.props.selectedServiceStyle, this.props.selectedKitchen, event.target.value, this.props.selectedMealName, this.state.search);
    } else if (event.target.name === SORT_BY) {
      this.props.updateSelectedSortBy(event.target.value);
    } else if (event.target.name === MEAL_NAME) {
      this.props.updateSelectedMealName(event.target.value);
      this.props.fetchOutCartOrders(this.props.selectedServiceStyle, this.props.selectedKitchen, this.props.selectedUnit, event.target.value, this.state.search)
    } else if (event.target.name === SEARCH){
      this.setState({ [event.target.name] : event.target.value, showClear: event.target.value !== ''});
      this.props.filterOutCartOrders(event.target.value);
    }
  };

  returnSelectedOrder(mealOrder) {
    if (this.props.selectedMealOrder && this.props.selectedMealOrder.id === mealOrder.id) {
      this.props.unselectMealOrder()
      this.setState({ mealOrderSelected: false, })
    }
    else {
      this.props.selectMealOrder(mealOrder);
      this.setState({ mealOrderSelected: true, })
    }
  }
  returnSelectedCart(zone, cartId, hasMealOrders) {
    if (this.state.mealOrderSelected === false)
      console.log("Please select an order before adding to this cart!")
    else {
      this.setState({ mealOrderSelected: false })
      this.props.addOrderToCart(this.props.selectedMealOrder.id, cartId, zone, hasMealOrders);
    }
  }

  markCartAsComplete(cartId, zone) {
    this.props.markCartAsComplete(cartId, zone);
  }

  addTraysBackToOutCart() {
    this.props.fetchOutCartOrders(this.props.selectedServiceStyle, this.props.selectedKitchen, this.props.selectedUnit, this.props.selectedMealName, this.state.search);
    return true;
  }

  removeTray(cartId, zone, mealOrderId) {
    this.props.removeTrayFromCart(cartId, zone, mealOrderId);
  }

  onClickRefresh() {

    this.setState({ showRefreshBtn: false, showRefreshLoading: true, enableLoader: false })
    this.refreshMealOrders();
  }

  refreshMealOrders() {
    this.props.fetchOutCartOrders(this.props.selectedServiceStyle, this.props.selectedKitchen, this.props.selectedUnit, this.props.selectedMealName, this.state.search);
    if (this.state.isInCart)
      this.props.fetchCarts()
    if (this.props.loadingMealOrdersAndCarts === false)
      this.setState({ showRefreshBtn: true, showRefreshLoading: false, enableLoader:true })
  }

  addTray() {
    if (this.state.mealOrderSelected === false)
      console.log("Please select an order before adding to this cart!")
    else {
      this.setState({ mealOrderSelected: false })
      this.props.addOrderToCompletedCart(this.props.selectedMealOrder, this.props.cart.id);
      this.handleClose();
    }
  }

  openInCartSummary(cart)
  {     
    if(cart.id) 
      this.props.openInCartSummary(cart,CART_SUMMARY, this.props.history);   
  }

  closeAlertMessage(){
    this.props.closeAlertMessage();
  }

  render() {
    if (!this.props.selectedServiceStyle && this.props.serviceStyles && this.props.serviceStyles.length > 0) {
      let selectedServiceStyle = this.getSelectedServiceStyle(this.props.serviceStyles)
      this.props.updateSelectedServiceStyle(selectedServiceStyle)
    }
    var filters = [
      { name: SERVICE_STYLE, value: this.props.selectedServiceStyle, default: SHOW_ALL_SERVICE_STYLES, optionArray: this.props.serviceStyles, showDefault: (this.props.serviceStyles && this.props.serviceStyles.length > 1), class: 'service-style-filter' },
      { name: BUILD_AREA, value: this.props.selectedKitchen, default: SHOW_ALL_BUILD_AREAS, optionArray: this.props.kitchens, class: 'incart-filter' },
      { name: UNIT, value: this.props.selectedUnit, default: SHOW_ALL_UNITS, optionArray: this.props.units, class: 'incart-filter' },
      { name: MEAL_NAME, value: this.props.selectedMealName, showDefault: false, optionArray: this.props.facilityMealNameArray, class: 'incart-filter' },
      { name: SORT_BY, value: this.props.selectedSortBy, showDefault: false, optionArray: INCART_SORT_BY_OPTION_ARRAY, class: 'incart-filter' }
    ]
    const dialogContent = <div style={{margin: '27px'}}>{this.props.alertMessage}</div>
    return ( 
      <div className={this.state.isInCart ? "container" : ""}>
        {!this.state.isInCart && this.props.isOffline &&
        <div style={{background: '#d2cece', color: '#676565', paddingLeft: '65px'}}><span> {OFFLINE_MODE_ON_MESSAGE} </span></div>
    }
        {this.state.showRefreshLoading && <div className="loader" style={{ background: 'transparent' }} />}
        {this.state.enableLoader && this.props.loadingIncart && <div className="loader"><img alt="Loading. Please wait..." className="loading-gif" src={require("../images/loading.gif")} /></div>}
        {this.state.isInCart && <AppHeader props={this.props} title={this.props.screenName} />}
        <div style={{ marginLeft: '-10px' }}>
        <div style={{float:'left', position:'relative'}}>
          <FiltersComponent menuClass="select-menu-incart" filters={filters} onChange={(e) => this.onChange(e)} />
        </div>
        <div style={{float:'left'}}>
        <CustomSearchBar 
          placeholder = {SEARCH_LABEL}
          class = {this.state.isInCart ? "search-custom-bar" : "search-custom-bar-add-trays"}
          display = {this.state.showClear}
          onChange = {this.onChange}
          clearSearch = {this.clearSearch}
          name = {SEARCH}
          value={this.state.search}
          />
        </div>  
        </div>
        <div style={{ marginLeft: '-10px', paddingTop: '-18px', marginTop: '-11px', }}  className="width-auto">
        <div className="heading-outer-style display-none zone-cart">
            <h6 >Meal Orders</h6>
          </div>
        <div className="refresh-button" onClick={this.onClickRefresh}><div className="refresh-button-image">{this.state.showRefreshLoading ? <img alt="" width='30px' src={require("../images/refresh-animation.svg")} /> : <img alt="" width='30px' src={require("../images/refresh-btn.png")} />}</div>
            <div className="refresh-button-text">{LOAD_NEW_TRAYS}</div>
          </div>
          <div className={this.state.isInCart ? "incart-panel-height outer-style position-initial" : "outer-style  position-initial"}>
            <div className={this.state.isInCart ? "incart-panel-height scroll" : "scroll"}>
              {(this.state.enableLoader && this.props.loadingIncart) || this.state.showRefreshLoading ?
                null :
                <OrderTicketList
                  emptyListMessage={NO_MORE_TRAYS}
                  handleClick={this.returnSelectedOrder}
                  mealOrders={this.props.outOfCartOrders}
                  selectedMealOrder={this.props.selectedMealOrder}
                />}
            </div>
          </div>
        </div>
        {this.state.isInCart &&
          <div className={"width-350"} style={{marginTop: '-11px'}}>
            <div className="heading-outer-style display-none zone-cart">
              <h6 >Carts</h6>
            </div>
            <div className={this.state.isInCart ? "incart-panel-height cart-details" : "cart-details"}>
              {
                this.props.carts.map((item, index) => {
                  return (
                    <Cart
                      openInCartSummary={this.openInCartSummary}
                      selectedCart={this.returnSelectedCart}
                      markCartAsComplete={this.markCartAsComplete}
                      removeTray={this.removeTray}
                      key={index}
                      active={(this.state.enableLoader && this.props.loadingIncart) || this.state.showRefreshLoading ? false : item && item.mealOrders && item.mealOrders.length > 0}
                      cart={(this.state.enableLoader && this.props.loadingIncart) || this.state.showRefreshLoading ? { zone: (index + 1).toString(), mealOrders: [] } : item}
                      addTraysBackToOutCart={this.addTraysBackToOutCart}
                    />
                  );
                })
              }
            </div>
          </div>
        }
        {!this.state.isInCart &&
          <div className="add-trays-margin-top width-330 top-20">
            <div className="cart-details middle delivered" >
              <div className={this.state.mealOrderSelected ? "btn-tray" : "btn-tray disabled"}
                color="primary" onClick={this.addTray}>
                Add Tray
              </div>
            </div>
          </div>
        }
        { this.props.showAlertMessage &&
                    <CustomizedDialogs dialogTitle={ERROR_WHILE_ADDING_MEAL_ORDERS}
                        dialogContent={dialogContent}
                        open={this.props.showAlertMessage} fullScreen={false}
                        handleClose={this.closeAlertMessage} />
                }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    outOfCartOrders: state.inCartReducer.outOfCartOrders,
    carts: state.inCartReducer.carts,
    selectedCart: state.inCartReducer.selectedCart,
    selectedMealOrder: state.inCartReducer.selectedMealOrder,
    serviceStyles: state.inCartReducer.serviceStyles,
    kitchens: state.inCartReducer.kitchens,
    units: state.inCartReducer.units,
    facilityMealNameArray: state.inCartReducer.facilityMealNameArray,
    selectedMealName: state.inCartReducer.selectedMealName,
    selectedSortBy: state.inCartReducer.selectedSortBy,
    selectedServiceStyle: state.inCartReducer.selectedServiceStyle,
    selectedKitchen: state.inCartReducer.selectedKitchen,
    selectedUnit: state.inCartReducer.selectedUnit,
    showAlertMessage: state.inCartReducer.showAlertMessage,
    alertMessage: state.inCartReducer.alertMessage,
    loadingMealOrdersAndCarts: state.loader.loadingMealOrdersAndCarts,
    loadingIncart: state.loader.loadingIncart,
    isOffline: state.offlineIndicator.isOffline,
  }
}
const mapDispatchToProps = {
  fetchOutCartOrders,
  fetchCarts,
  selectMealOrder,
  addOrderToCart,
  fetchAllUnitsForSelectedKitchen,
  fetchAllKitchensForSelectedFacility,
  fetchAllServiceStylesForSelectedFacility,
  markCartAsComplete,
  removeTrayFromCart,
  unselectMealOrder,
  addOrderToCompletedCart,
  openInCartSummary,
  closeAlertMessage,
  updateSelectedSortBy,
  updateSelectedMealName,
  updateSelectedKitchen,
  updateSelectedServiceStyle,
  updateSelectedUnit,
  fetchFacilityMealNameArrayForSelectedFacility,
  filterOutCartOrders,
}

InCart.defaultProps = {
  screenName: INCART_SCREEN_NAME,
};

export default connect(mapStateToProps, mapDispatchToProps)(InCart);