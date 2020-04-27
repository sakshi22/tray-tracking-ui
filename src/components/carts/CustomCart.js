import React from "react";

const CustomCart = ({ carts, openSummary }) => {

        if(carts && Array.isArray(carts)) {
            return carts.map((cart, index) => (
                // <div className="content-outer">
            <div className={(cart.status === 'COMPLETED' || cart.status === 'CHECKED') ?
            		"depart-cart-detail cart-detail light-blue" : "cart-detail light-blue"}
            			onClick={()=>openSummary(cart)}>
            <div className={(cart.status === 'COMPLETED' || cart.status === 'CHECKED') ? "depart-cart-icon cart-icon" : "cart-icon"}>
            
                <div className="pull-left">Zone {cart.zone}</div>
                <div className="pull-right">{cart.firstMealOrderTime} min</div> 
                
                {
                	(cart.status === 'COMPLETED' || cart.status === 'CHECKED') &&
                	<div className="order-id min-deliver-time width-inherit">Deliver by {cart.minimumDeliveryTime}</div>
                }
                
              {
            	  (cart.status === 'COMPLETED' || cart.status === 'CHECKED')  &&
                  <div className="order-id width-inherit">{cart.mealOrders.slice(0,12).map((mealOrder, index) => {
                    return <span>{index > 0 && index%4 === 0 && <br/>}{mealOrder.ticketNumber}
                    {index < 11 && index !== cart.mealOrders.length - 1 && <span>, </span>} 
                    {index === 11 && cart.mealOrders.length > 12  && <span>...</span>}
                    </span>
                })}</div>
              }
              {
                 cart.status === 'DEPARTED' &&
                  <div className="order-id width-inherit">{cart.mealOrders.filter(item => item.trackingStatus === 'DEPARTED').slice(0,5).map((mealOrder, index) => {
                    return <span>{index > 0 && index%3 === 0 && <br/>}#{mealOrder.ticketNumber}
                    {index < 4 && index !== cart.mealOrders.filter(item => item.trackingStatus === 'DEPARTED').length - 1 && <span>, </span>} 
                    {index === 4 && cart.mealOrders.filter(item => item.trackingStatus === 'DEPARTED').length > 5  && <span>...</span>}
                    </span>
                })}</div>
              }  
              
              
            </div> 
		</div> 
        // </div>
            ));
        }
}

export default CustomCart;