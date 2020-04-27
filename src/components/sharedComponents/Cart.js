import React, { Component } from "react";
import MyDialog from './CustomizedDialogs';
import CartSummary from '../CartSummary';
class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anyTrayRemoved: false,
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.removeTray = this.removeTray.bind(this)
    this.selectTrayToRemove = this.selectTrayToRemove.bind(this)
  }
  handleClick() {
    this.props.selectedCart(this.props.cart.zone, this.props.cart.id, this.props.cart.mealOrders && this.props.cart.mealOrders.length > 0);
  }

  handleClickOpen() {
    /*if (this.props.active) {
      this.setState({ open: true })
    }*/ 
    this.props.openInCartSummary(this.props.cart);
  };
  handleClose() {
    if (this.state.anyTrayRemoved)
      this.props.addTraysBackToOutCart();
    //this.props.unselectCartMealOrders(this.props.cart.zone)
    this.setState({ open: false, anyTrayRemoved: false })
  };
  handleActionClick() {
    this.props.markCartAsComplete(this.props.cart.id, this.props.cart.zone);
    this.setState({ open: false })
  };
  removeTray(mealOrderId) {
    if (this.state.anyTrayRemoved === false) {
      this.setState({ anyTrayRemoved: true })
    }
    this.props.removeTray(this.props.cart.id, this.props.cart.zone, mealOrderId)
  };
  selectTrayToRemove(mealOrderId) {
    this.props.selectTrayToRemove(this.props.cart.id, mealOrderId, this.props.cart.zone)
  }
  render() {
    const cartSummary = <CartSummary
      handleActionClick={this.handleActionClick}
      removeTray={this.removeTray}
      selectTrayToRemove={this.selectTrayToRemove}
      dialogActionTitle="Cart Ready For Next Step" mealOrders={this.props.cart.mealOrders} />
    return (
      <div id={this.props.cart.zone}

        className={this.props.active ? 'cart-zone-box active' : 'cart-zone-box'}
      >
        <div className="cart-list" onClick={this.handleClick}>
    <div className="zone-number">{this.props.cart.zone < 10 && <span style={{color:'white'}}>0</span>}{this.props.cart.zone}</div>

          {
            this.props.active ? <div className="cart-info">
              <div style={{width: '115px'}} className="order-id">{this.props.cart.mealOrders.slice(0,5).map((mealOrder, index) => {
                        return <span>{index > 0 && index%3 === 0 && <br/>}#{mealOrder.ticketNumber}
                        {index < 4 && index !== this.props.cart.mealOrders.length - 1 && <span>, </span>} 
                        {index === 4 && this.props.cart.mealOrders.length > 5  && <span>...</span>}
                        </span>
                    })}</div>
              <div className="total-item">TOTAL<br />
                <b>{this.props.cart.mealOrders.length}</b>   </div></div> :
              <div className="cart-info">
                <span className="plus-icon">+</span>
                <span className="grab-cart"> Grab Cart</span> </div>

          }
        </div>
        <div className="arrow-proceed" onClick={this.handleClickOpen}></div>
        <MyDialog
          dialogContent={cartSummary}
          dialogTitle="Cart Summary"
          handleClose={this.handleClose}
          onClick={this.handleClickOpen}
          open={this.state.open} />
      </div>
    );
  }
}
Cart.defaultProps = {
  active: false,
  mealOrders: [],
  id: '',
};
export default Cart;