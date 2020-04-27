import React from "react";
import { RUSH, NOW } from "../../redux/actions/Constants";

const OrderTicket = (props) => {
  return(
    <div id={props.mealOrder.id} onClick={() => props.handleClick(props.mealOrder, props.isUndoEnable)}
      className={props.active? 'order-detail-list active': 'order-detail-list' }>
        {
                    props.isUndoEnable ? 
                    <div className="tray-delivered">
                         <button onClick={() => props.onUndo(props.mealOrder)} className="undo-bttn">Undo	</button>
                    </div> : null
                }
      <div className="header-dark">
        <div className="pull-left">#{props.mealOrder.ticketNumber}</div>
        <div className="pull-right">Zone {props.mealOrder.zone}</div>
      </div>
      <div className="text-bold">
      <span className="text-ellipsis"  style={{maxWidth: '90%'}}>{props.mealOrder.unitName}</span>
      <br />
        <span className="text-ellipsis" style={{maxWidth: '43%'}}>{props.mealOrder.roomName}</span>
        <span className="text-ellipsis">/</span>
        <span className="text-ellipsis" style={{maxWidth: '43%'}}>{props.mealOrder.bedName}</span>
      </div>
      {!props.isUndoEnable?
      <div className="ticket-footer-dark">
        <div className={props.mealOrder.rushOrder || props.mealOrder.nowTray ? 'ticket-footer-text main-text' : 'ticket-footer-text'}>
        {props.showDeliveryTime ? props.mealOrder.deliveryTime 
        : props.mealOrder.timeFromDelivery +' min'}
        <span className="rush_indicator">{props.mealOrder.rushOrder && RUSH}</span>
        <span className="rush_indicator">{props.mealOrder.nowTray && NOW}</span>
        </div>
      </div> : null }
    </div>
);
}
  OrderTicket.defaultProps = {
    active: false,
    showDeliveryTime: true,
    isUndoEnable: false,
  };
export default OrderTicket;