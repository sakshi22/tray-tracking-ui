import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchReadyToDeliverCarts} from '../redux/actions/DeliveredAction';
import { fetchAllUnitsForSelectedKitchen } from '../redux/actions/InCartAction';
import { openDepartedSummary } from '../redux/actions/DepartureAction';
import CustomCart from './carts/CustomCart';
import AppHeader from "./sharedComponents/AppHeader";
import { DELIVERED, NO_CART_AVAILABLE } from '../redux/actions/Constants'
 
class Delivered extends Component {

  constructor(props) {
    super(props);
    this.openDeliveredSummary = this.openDeliveredSummary.bind(this);
  }

  componentWillMount() {
    this.props.fetchReadyToDeliverCarts();
    this.props.fetchAllUnitsForSelectedKitchen(-1, -1)
  }

  openDeliveredSummary(cart)
  {     
    this.props.openDepartedSummary(cart, this.props.history, DELIVERED);   
  }

render() {
  return (

    <div className="container">
      {this.props.loading && <div className="loader"><img alt="Loading. Please wait..." className="loading-gif" src={require("../images/loading.gif")}/></div>}
      <AppHeader props={this.props} title='Tray Delivery'/>
      <div className="content-outer">
      {
        this.props.readyToDeliverCarts &&  this.props.readyToDeliverCarts.length > 0 ? 
        <span className="cart-box">
          <h4>Tap cart to view meal orders to mark as Delivered</h4>
            {this.props.loading ? null : <CustomCart carts= {this.props.readyToDeliverCarts} openSummary = {this.openDeliveredSummary}/> }
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
    readyToDeliverCarts : state.deliverReducer.carts,
    units: state.inCartReducer.units,
    loading: state.loader.loading,
    isOffline: state.offlineIndicator.isOffline,
  }
}
const mapDispatchToProps = {
  fetchReadyToDeliverCarts,
  openDepartedSummary,
  fetchAllUnitsForSelectedKitchen,
}
export default connect(mapStateToProps, mapDispatchToProps)(Delivered);