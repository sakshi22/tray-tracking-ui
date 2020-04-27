import { READY_TO_DELIVER_CARTS } from '../actions/Types';

export const initialState = {
    carts:[],
    selectedCart: {}
}

export default (state = initialState, action) => {

    switch(action.type) {
        case READY_TO_DELIVER_CARTS:
            var respCarts=action.data
            var carts = []
            if(respCarts && respCarts.length>0){
            respCarts.forEach(responseCart => {
                if(responseCart.mealOrders.length!==0){
                if(responseCart.mealOrders.filter(item => item.trackingStatus === 'DEPARTED').length>0)
                    carts.push(responseCart)
                }
            });
        }
            return {...state, 
                carts   
            }        
        default:
            return state;
    }
}
