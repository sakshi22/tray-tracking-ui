import React, { Component } from "react";
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import OrderTicketList from "./sharedComponents/OrderTicketList";
import { EMPTY_CART_DELETE_MESSAGE, CART_SUMMARY } from "../redux/actions/Constants";
import { goToInCart } from '../redux/actions/TrayEventsAction'
import { selectMealOrder, markCartAsComplete, removeTrayFromCart, unselectMealOrder } from '../redux/actions/InCartAction';
import AppHeader from "./sharedComponents/AppHeader";
class CartSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMealOrder: -1,
    }
    this.handleActionClick = this.handleActionClick.bind(this)
    this.returnSelectedOrder = this.returnSelectedOrder.bind(this)
    this.removeTray = this.removeTray.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.showCartSummary !== nextProps.showCartSummary)
      this.props.goToInCart(this.props.history);
  }
  handleActionClick() {
    if (this.props.selectedCart.mealOrders !== undefined && this.props.selectedCart.mealOrders.length !== 0)
      this.props.markCartAsComplete(this.props.selectedCart.id, this.props.selectedCart.zone);
  };
  returnSelectedOrder(mealOrder) {
    if (this.state.selectedMealOrder.id === mealOrder.id)
      this.setState({ selectedMealOrder: -1 })
    else
      this.setState({ selectedMealOrder: mealOrder })
  }
  removeTray() {
    if (this.state.selectedMealOrder === -1)
      console.log("Please select a tray to remove");
    else {
      this.props.removeTrayFromCart(this.props.selectedCart.id, this.props.selectedCart.zone, this.state.selectedMealOrder.id);
      this.setState({ selectedMealOrder: -1 })
    }
  }
  render() {
    var CartBtnClassName = this.props.selectedCart && (this.props.selectedCart.mealOrders === undefined || this.props.selectedCart.mealOrders.length === 0) ? "cart-departed" : "cart-departed active";
    return (
      <div>
        {this.props.selectedCart && <div className="container">
        {this.props.loading && <div className="loader"><img alt="Loading. Please wait..." className="loading-gif" src={require("../images/loading.gif")}/></div>}
          <AppHeader props={this.props} showBack={true} title={CART_SUMMARY} />
          <div className="width-auto text-center">
            <Button style={{left : '175px'}} variant="contained" color="primary" className={CartBtnClassName} onClick={this.handleActionClick} >Cart Ready for High Risk Tray Check</Button>
            <div className="outer-style less-255">
              <div className="scroll">
                <OrderTicketList
                  emptyListMessage={EMPTY_CART_DELETE_MESSAGE}
                  mealOrders={this.props.selectedCart.mealOrders}
                  selectedMealOrder={this.state.selectedMealOrder}
                  handleClick={this.returnSelectedOrder}
                />
              </div>
            </div>
          </div>
          <div className="width-330">
            <div className="cart-details middle less-255 margin-top-20" >
              <div style={{ margin:'auto' }}>
                <div className={this.state.selectedMealOrder === -1 ? "btn-tray disabled" : "btn-tray "}
                  color="primary" onClick={this.removeTray}>Remove Tray</div>
              </div>
            </div>
          </div>
        </div>}</div>

    );
  }
}
const mapStateToProps = state => {
  return {
    selectedCart: state.inCartReducer.selectedCart,
    showCartSummary: state.inCartReducer.showCartSummary,
    selectedScreen: state.inCartReducer.selectedScreen,
    loading: state.loader.loading,
    isOffline: state.offlineIndicator.isOffline,
  }
}
const mapDispatchToProps = {
  selectMealOrder,
  markCartAsComplete,
  removeTrayFromCart,
  unselectMealOrder,
  goToInCart,
}
CartSummary.defaultProps = {
  showAddTrayBtn: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartSummary);