import {
    READY_TO_DEPART_CARTS, OPEN_CART_SUMMARY,
    CLOSE_CART_SUMMARY,
    UPDATE_DELIVERED_SUCCESS, ADD_TO_COMPLETED_CART,
    UPDATE_UNDO_DELIVERED_SUCCESS,
    SORT_AND_FILTER_TRAYS,
    REMOVE_TRAY_FROM_DEPART_CART,
    MARK_CART_DEPARTED_SUCCESS,
    HIDE_CONFIRMATION,
    REMOVE_TRAY_FROM_HIGH_RISK_CHECK_CART,
    FILTER_DEPART_CARTS,
    FETCH_SERVICE_STYLES_AND_KITCHENS,
    FILTER_KITCHENS_FOR_SELECTED_SERVICE_STYLE
} from '../actions/Types';
import { DELIVERED, DEPARTED, DELIVERY_DATE_TIME_SORT, DELIVERED_STATUS, RECOVERED_STATUS } from '../actions/Constants';
import { sortOn } from '../../utils/sort'

export const initialState = {
    carts: [],
    selectedCart: {},
    selectedScreen: "",
    traysToBeDelivered: [],
    deliveredTrays: [],
    cartMarkedDepartedSuccessMessage: false,
    errorWhileDepartingMessage: false,
    allDepartedCartList: [],
    kitchens: [],
    filteredKitchens: [],
    serviceStyles: [],
}

export default (state = initialState, action) => {

    switch (action.type) {
        case FETCH_SERVICE_STYLES_AND_KITCHENS:
            var kitchenList = action.kitchenList;
            var kitchens = [];
            var serviceStyles = [];
            kitchenList.forEach((k) => {
                kitchens.push({ id: k.id, name: k.name, serviceStyle: k.serviceStyleId })
                serviceStyles.push({ id: k.serviceStyleId, name: k.serviceStyleName })
            })
            serviceStyles = serviceStyles.filter((set => a => !set.has(a.id) && set.add(a.id))(new Set));
            serviceStyles = serviceStyles.sort(function (a, b) { return b.id.localeCompare(a.id) })
            return {
                ...state,
                serviceStyles,
                kitchens,
                filteredKitchens: kitchens,
            }
        case FILTER_KITCHENS_FOR_SELECTED_SERVICE_STYLE:
            var filteredKitchens = state.kitchens.filter((k) => {
                return action.selectedServiceStyle === '-1' || action.selectedServiceStyle === k.serviceStyle
            })
            return {
                ...state,
                filteredKitchens,
            }
        case READY_TO_DEPART_CARTS:
            var allDepartedCartList = action.data
            return {
                ...state,
                allDepartedCartList,
                carts: allDepartedCartList,
            }
        case FILTER_DEPART_CARTS:
            allDepartedCartList = [...state.allDepartedCartList]
            var carts = allDepartedCartList.filter((cart) => {
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
        case OPEN_CART_SUMMARY:
            var selectedCart = action.selectedCart;
            if (action.selectedScreen === DELIVERED) {

                var combinedList = createDeliveredAndUndoLists(selectedCart.mealOrders)
                var deliveredTrays = combinedList[1];
                var traysToBeDelivered = combinedList[0];
                selectedCart.deliveredTrays = deliveredTrays.sort(sortOn(DELIVERY_DATE_TIME_SORT));
                selectedCart.traysToBeDelivered = traysToBeDelivered.sort(sortOn(DELIVERY_DATE_TIME_SORT));
            }
            return {
                ...state,
                selectedCart: action.selectedCart,
                isOpen: true,
                selectedScreen: action.selectedScreen,
                cartMarkedDepartedSuccess: undefined
            }

        case CLOSE_CART_SUMMARY:
            return {
                ...state,
                selectedCart: null,
                isOpen: false,
                cartMarkedDepartedSuccess: undefined
            }
        case MARK_CART_DEPARTED_SUCCESS:
            return {
                ...state,
                cartMarkedDepartedSuccessMessage: action.status,
                errorWhileDepartingMessage: !action.status,
            }
        case HIDE_CONFIRMATION:
            return {
                ...state,
                cartMarkedDepartedSuccessMessage: false,
                errorWhileDepartingMessage: false,
            }
        case UPDATE_DELIVERED_SUCCESS:
            var currentSelectedCart = Object.assign({}, action.selectedCart);
            var trayDelivered = currentSelectedCart.traysToBeDelivered.filter(item => item.id === action.selectedMealOrder.id)[0]
            trayDelivered.trackingStatus = DELIVERED
            trayDelivered.isUndoEnable = true;
            currentSelectedCart.deliveredTrays.push(trayDelivered)
            traysToBeDelivered = currentSelectedCart.traysToBeDelivered.filter(item => item.id !== action.selectedMealOrder.id)
            currentSelectedCart.traysToBeDelivered = traysToBeDelivered;
            if (action.sortBy !== -1) {
                currentSelectedCart.deliveredTrays.sort(sortOn(action.sortBy))
                currentSelectedCart.traysToBeDelivered.sort(sortOn(action.sortBy))
            }
            return {
                ...state,
                selectedCart: currentSelectedCart
            }
        case UPDATE_UNDO_DELIVERED_SUCCESS:
            currentSelectedCart = Object.assign({}, action.selectedCart);
            var trayUndoDelivered = currentSelectedCart.deliveredTrays.filter(item => item.id === action.selectedMealOrder.id)[0]
            trayUndoDelivered.trackingStatus = DEPARTED
            trayUndoDelivered.isUndoEnable = false;
            currentSelectedCart.traysToBeDelivered.push(trayUndoDelivered)
            deliveredTrays = currentSelectedCart.deliveredTrays.filter(item => item.id !== action.selectedMealOrder.id)
            currentSelectedCart.deliveredTrays = deliveredTrays;
            if (action.sortBy !== -1) {
                currentSelectedCart.deliveredTrays = currentSelectedCart.deliveredTrays.sort(sortOn(action.sortBy))
                currentSelectedCart.traysToBeDelivered = currentSelectedCart.traysToBeDelivered.sort(sortOn(action.sortBy))
            }
            return {
                ...state,
                selectedCart: currentSelectedCart
            }
        case ADD_TO_COMPLETED_CART: {
            selectedCart = state.selectedCart;
            selectedCart.mealOrders.push(action.mealOrder)
            return {
                ...state,
                selectedCart,
            };
        }
        case SORT_AND_FILTER_TRAYS: {
            selectedCart = Object.assign({}, action.selectedCart);
            combinedList = createDeliveredAndUndoLists(selectedCart.mealOrders)
            deliveredTrays = combinedList[1];
            traysToBeDelivered = combinedList[0];
            if (action.unitId !== -1) {
                deliveredTrays = deliveredTrays.filter(item => item.unitId === action.unitId)
                traysToBeDelivered = traysToBeDelivered.filter(item => item.unitId === action.unitId)
            }
            if (action.sortBy !== -1) {
                deliveredTrays.sort(sortOn(action.sortBy))
                traysToBeDelivered.sort(sortOn(action.sortBy))
            }
            selectedCart.deliveredTrays = deliveredTrays;
            selectedCart.traysToBeDelivered = traysToBeDelivered;
            return {
                ...state,
                selectedCart,
            }
        }

        case REMOVE_TRAY_FROM_DEPART_CART: case REMOVE_TRAY_FROM_HIGH_RISK_CHECK_CART: {
            selectedCart = Object.assign({}, state.selectedCart);
            var selectedOrderIndex = -1;
            selectedCart.mealOrders.forEach((mealOrder, index) => {
                if (mealOrder.id === action.mealOrderId) {
                    selectedOrderIndex = index;
                }
            })
            selectedCart.mealOrders.splice(selectedOrderIndex, 1);
            return {
                ...state,
                selectedCart
            };
        }
        default:
            return state;
    }
}

function createDeliveredAndUndoLists(mealOrders) {
    var deliveredTrays = [];
    var traysToBeDelivered = [];
    mealOrders.forEach(mealOrder => {
        if (mealOrder.trackingStatus === DELIVERED_STATUS) {
            var tray = mealOrder
            tray.isUndoEnable = true
            deliveredTrays.push(tray);
        }
        else if (mealOrder.trackingStatus !== RECOVERED_STATUS) {
            traysToBeDelivered.push(mealOrder)
        }
    }
    )
    return [traysToBeDelivered, deliveredTrays];
}