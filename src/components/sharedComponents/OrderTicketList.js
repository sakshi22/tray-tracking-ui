import React from "react";
import OrderTicket from "./OrderTicket";

const OrderTicketList = (props) => {
    if(props.mealOrders && Array.isArray(props.mealOrders) && props.mealOrders.length>0) {
        return props.mealOrders.map((item, index) => (
            <OrderTicket
                handleClick={props.handleClick}
                key={index}
                mealOrder={item}
                active={props.selectedMealOrder && props.selectedMealOrder.id && props.selectedMealOrder.id===item.id}
                isUndoEnable={item.isUndoEnable} 
                showDeliveryTime={props.showDeliveryTime}
                onUndo={props.onUndo}
            />
        ));
    } else {
        return(
        <div>{props.emptyListMessage}</div>
        )
    }
}
export default OrderTicketList;