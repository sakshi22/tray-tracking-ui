import {get, post} from '../../services/httpService';
import { READY_TO_DEPART_CARTS, OPEN_CART_SUMMARY, 
    CLOSE_CART_SUMMARY,
    ADD_TO_COMPLETED_CART,
    UNSELECT_MEAL_ORDER,
    REMOVE_ADDED_OUT_CART_ORDERS,
    SORT_AND_FILTER_TRAYS, 
    LOADING,
    REMOVE_FROM_OUT_CART_ORDERS,
    HIDE_CONFIRMATION,
    MARK_CART_DEPARTED_SUCCESS,
    LOADING_SCREEN,
    FILTER_DEPART_CARTS,
    FETCH_SERVICE_STYLES_AND_KITCHENS,
    FILTER_KITCHENS_FOR_SELECTED_SERVICE_STYLE} from './Types';

export const fetchReadyToDepartCarts = () => ((dispatch) => {
    dispatch({type:LOADING_SCREEN, loadingCarts:true})
    return get({
        url : '/traytracking/fetchReadyToDepartCarts'
    }).then((res) => {
        dispatch({type:READY_TO_DEPART_CARTS, data: res.data});
        dispatch({type:LOADING_SCREEN, loadingCarts:false})
    }).catch((e) => {
        console.log("Error while fetching ready to depart carts.")
        dispatch({type:LOADING_SCREEN, loadingCarts:false})
    })
})

export const filterCarts = (selectedServiceStyle, selectedKitchenId, searchText) => ((dispatch) => {
    dispatch({type:FILTER_DEPART_CARTS, selectedServiceStyle, selectedKitchenId, searchText})
})
export const fetchAllServiceStylesAndKitchens = () => ((dispatch) => {
    dispatch({type:LOADING_SCREEN, loadingServiceStyles:true})
    return get({
        url : '/traytracking/fetchAllServiceStylesAndKitchens'
    }).then((res) => {
        dispatch({type:FETCH_SERVICE_STYLES_AND_KITCHENS, kitchenList: res.data});
        dispatch({type:LOADING_SCREEN, loadingServiceStyles:false})
    }).catch((e) => {
        console.log("Error while fetching service styles and kitchen for departure carts.")
        dispatch({type:LOADING_SCREEN, loadingServiceStyles:false})
    })
})

export const openDepartedSummary = (selectedCart, history, selectedScreen) => ((dispatch) => {
    dispatch({type:OPEN_CART_SUMMARY, selectedCart, selectedScreen})
    history.push('/departCartSummary');
})

export const closeDepartedSummary = () => ((dispatch) => {
    dispatch({type:CLOSE_CART_SUMMARY});
})

export const addOrderToCompletedCart =(mealOrder,cartId) =>
((dispatch) => {
    dispatch({type:LOADING_SCREEN, loadingCarts:true})
    return post({
            url:'/traytracking/addMealOrderToCart',
            data: {id:cartId,mealOrderId:mealOrder.id},
        }).then((response) => {
            dispatch({type:LOADING_SCREEN, loadingCarts:false})
            dispatch({type:ADD_TO_COMPLETED_CART, mealOrder })
            dispatch({type:REMOVE_ADDED_OUT_CART_ORDERS, mealOrderId:mealOrder.id})
        }).catch((e) => {
            dispatch({type:LOADING_SCREEN, loadingCarts:false})
            dispatch({type:UNSELECT_MEAL_ORDER})
            if(e.response.data === 'Meal Order already added to some other cart.')
                dispatch({type:REMOVE_FROM_OUT_CART_ORDERS, mealOrderId:mealOrder.id })
            else
                console.log("Error while adding meal order: "+e)
        })

})

export const markCartDeparted = (cart) => ((dispatch) => {
    dispatch({type:LOADING, flag:true})
    return post({
        url:'/traytracking/markCartDeparted',
        data: {id:cart.id}
    }).then((res) => {
        dispatch({type:LOADING, flag:false})
        dispatch({type:MARK_CART_DEPARTED_SUCCESS, status: true});
        get({
            url : '/traytracking/fetchReadyToDeliverCarts'
        })
        get({
            url : '/traytracking/fetchReadyToDepartCarts'
        })

    }).catch((e) => {
        dispatch({type:MARK_CART_DEPARTED_SUCCESS, status: false});
        dispatch({type:LOADING, flag:false})
    })

})

export const openDepartedCartSummary = (cart, history, selectedScreen) => ((dispatch) => {
    dispatch({type:OPEN_CART_SUMMARY, selectedCart: cart, selectedScreen});
        history.push('/departCartSummary');
})

export const sortAndFilterTrays = (selectedCart, unitId, sortBy) => ((dispatch) => {
    dispatch({type:SORT_AND_FILTER_TRAYS, selectedCart, unitId, sortBy})
})

export const hideConfirmationPopup = () => ((dispatch) => {
    dispatch({type:HIDE_CONFIRMATION})
})

export const filterKitchenBySelectedServiceStyle = (selectedServiceStyle) => ((dispatch) => {
    dispatch({type: FILTER_KITCHENS_FOR_SELECTED_SERVICE_STYLE, selectedServiceStyle})
})