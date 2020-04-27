import {
    READY_TO_HIGH_RISK_TRAY_CHECK_CARTS, 
    MARK_CART_CHECKED_SUCCESS,
    HIDE_ERROR_MESSAGE,
    FILTER_HIGH_RISK_CARTS,
    FETCH_HIGH_RISK_SERVICE_STYLES_KITCHENS,
    HIGH_RISK_FILTER_KITCHENS} from '../actions/Types';

export const initialState = {
    carts: [],
    errorWhileHighRiskChecking: false,
    allHighRiskCartList: [],
    selectedServiceStyle: -1,
    selectedKitchen: -1,
    selectedScreen: "",
    kitchens: [],
    filteredKitchens: [],
    serviceStyles: [],
}

export default (state = initialState, action) => {

    switch (action.type) {
        case READY_TO_HIGH_RISK_TRAY_CHECK_CARTS:
            var allHighRiskCartList = action.data
            return {
                ...state,
                allHighRiskCartList,
                carts : action.data,
            }

        case FILTER_HIGH_RISK_CARTS:
            allHighRiskCartList = [...state.allHighRiskCartList]
            var carts = allHighRiskCartList.filter((cart) => {
                return cart.mealOrders.some((mo) => {
                    return (action.selectedKitchenId !== '-1' ? parseInt(mo.kitchenId) === parseInt(action.selectedKitchenId) :
                action.selectedServiceStyle !== '-1' ? mo.serviceStyle === action.selectedServiceStyle : true) }
            )});
            
            if(action.searchText !== ''){
                carts = carts.filter((cart) => {
                    return cart.mealOrders.some((mo) => { return mo.ticketNumber.toString().includes(action.searchText) }
                )});
            }
            
            
            return {
                ...state,
                carts,
            }
        
		case MARK_CART_CHECKED_SUCCESS:
            return {
                ...state,
                errorWhileHighRiskChecking: !action.status,
            }
        case HIDE_ERROR_MESSAGE:
            return {
                ...state,
                errorWhileHighRiskChecking: false,
            }
       
        default:
            return state;
    }
}