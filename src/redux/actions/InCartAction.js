import { FETCH_OUT_CART_ORDERS,
    SELECT_MEAL_ORDER,
    ADD_TO_CART,
    FETCH_CARTS,
    FETCH_UNITS,
    FETCH_KITCHENS,
    FETCH_SERVICE_STYLES,
    REMOVE_TRAY_FROM_CART,
    DELETE_CART,
    UNSELECT_MEAL_ORDER,
    OPEN_INCART_SUMMARY,
    REMOVE_TRAY_FROM_DEPART_CART,
    LOADING,
    CLOSE_ALERT_MESSAGE,
    SHOW_CART_ALREADY_EXISTS_MESSAGE,
    REMOVE_FROM_OUT_CART_ORDERS,
    LOADING_SCREEN,
    UPDATE_SELECTED_SORT_BY,
    FETCH_FACILITY_MEAL_NAMES,
    UPDATE_SELECTED_MEAL_NAME,
    UPDATE_SELECTED_SERVICE_STYLE,
    UPDATE_SELECTED_KITCHEN,
    UPDATE_SELECTED_UNIT,
    REMOVE_TRAY_FROM_HIGH_RISK_CHECK_CART,
    FILTER_OUT_CART_ORDERS,
 } from './Types';
import history from '../../services/history';
import {get, post} from '../../services/httpService';

export const goToInCart =() => 
((dispatch) => {
    history.push('/inCart');
})

export const fetchAllServiceStylesForSelectedFacility = () => {
    return (dispatch) => {
        dispatch({type:LOADING_SCREEN, loadingServiceStyles:true})
        return get({
            url:'/traytracking/fetchServiceStyles'
        }).then((response)=>{
            dispatch({type:FETCH_SERVICE_STYLES, serviceStyles:response.data })
            dispatch({type:LOADING_SCREEN, loadingServiceStyles:false})
        }).catch((e)=>{
            console.log("Error while fetching service styles: "+e)
            dispatch({type:LOADING_SCREEN, loadingServiceStyles:false})
        })       
    }
}

export const fetchAllKitchensForSelectedFacility = (serviceStyle) => {
    return (dispatch) => {
        dispatch({type:LOADING_SCREEN, loadingKitchens:true})
        return get({
            url:'/traytracking/fetchKitchens/?serviceStyle='+serviceStyle
        }).then((response)=>{
            dispatch({type:FETCH_KITCHENS, kitchens:response.data })
            dispatch({type:LOADING_SCREEN, loadingKitchens:false})
        }).catch((e)=>{
            console.log("Error while fetching kitchens: "+e)
            dispatch({type:LOADING_SCREEN, loadingKitchens:false})
        })       
    }
}
export const fetchAllUnitsForSelectedKitchen = (serviceStyle,kitchenId) => {
    return (dispatch) => {
        dispatch({type:LOADING_SCREEN, loadingUnits:true})
        return get({
            url:'/traytracking/fetchUnits/?serviceStyle='+serviceStyle+'&kitchenId='+kitchenId
        }).then((response)=>{
            dispatch({type:LOADING_SCREEN, loadingUnits:false})
            dispatch({type:FETCH_UNITS, units:response.data })
        }).catch((e)=>{
            dispatch({type:LOADING_SCREEN, loadingUnits:false})
            console.log("Error while fetching units: "+e)
        })       
    }
}

export const fetchOutCartOrders = (serviceStyle, kitchenId, unitId, mealNameId, searchText) => {
    return (dispatch) => {
        dispatch({type:LOADING_SCREEN, loadingOutCartMealOrders:true})
        return get({
            url:'/traytracking/fetchOutCartMealOrders/?serviceStyle='+serviceStyle+'&kitchenId='+kitchenId+'&unitId='+unitId+'&mealNameId='+mealNameId,
        }).then((response)=>{   
            dispatch({type:FETCH_OUT_CART_ORDERS, outOfCartOrders: response.data})
            dispatch({type:FILTER_OUT_CART_ORDERS, searchText})
            dispatch({type:LOADING_SCREEN, loadingOutCartMealOrders:false})
        }).catch((e)=>{
            dispatch({type:LOADING_SCREEN, loadingOutCartMealOrders:false})
            console.log("Error while fetching out cart orders: "+e)
        })       
    }
}

export const filterOutCartOrders = (searchText) => ((dispatch) => {
    dispatch({type:FILTER_OUT_CART_ORDERS, searchText})
})

export const fetchCarts = () => {
    return (dispatch) => {
        dispatch({type:LOADING_SCREEN, loadingCarts:true})
        return get({
            url:'/traytracking/fetchInProgressCarts',
        }).then((response) => {
            dispatch({type:LOADING_SCREEN, loadingCarts:false})
            dispatch({type:FETCH_CARTS, responseCarts:response.data})
        }).catch((e) => {
            dispatch({type:LOADING_SCREEN, loadingCarts:false})
            console.log("Error while fetching in progress carts: "+e)
        })             
    }
}

export const addOrderToCart =(mealOrderId,cartId, zone, hasMealOrders) =>
//If there is atleast one meal order, id is already updated with it's id in db
//Else a call needs to be made to make an entry for cart in db and fetch id
((dispatch) => {
    dispatch({type:LOADING_SCREEN, loadingCarts:true})
    //on successful axios call
    if(hasMealOrders){
        return post({
            url:'/traytracking/addMealOrderToCart',
            data: {id:cartId,mealOrderId},
        }).then((response) => {
            dispatch({type:ADD_TO_CART, cartId, zone, hasMealOrders })
            dispatch({type:LOADING_SCREEN, loadingCarts:false})
        }).catch((e) => {
            dispatch({type:LOADING_SCREEN, loadingCarts:false})
            dispatch({type:UNSELECT_MEAL_ORDER})
            if(e.response.data === 'Meal Order already added to some other cart.')
                dispatch({type:REMOVE_FROM_OUT_CART_ORDERS, mealOrderId })
            else
                console.log("Error while adding meal order: "+e)
        })
        
    } else {
        return post({
            url:'/traytracking/createCartAndAddMealOrder',
            data: {zone,mealOrderId},
        }).then((response) => {
            dispatch({type:ADD_TO_CART, cartId: response.data, zone, hasMealOrders })
            dispatch({type:LOADING_SCREEN, loadingCarts:false})            
        }).catch((e) => {
            if(e.response.data === 'Meal Order already added to some other cart.')
                dispatch({type:REMOVE_FROM_OUT_CART_ORDERS, mealOrderId })
            else if(e.response.data === 'Cart already added for this zone.'){
                    dispatch({type:SHOW_CART_ALREADY_EXISTS_MESSAGE, })
            } else
                console.log("Error while adding meal order:"+e)
            dispatch({type:LOADING_SCREEN, loadingCarts:false})
            dispatch({type:UNSELECT_MEAL_ORDER})
        })
    }
})

export const markCartAsComplete =(cartId, zone) =>
((dispatch) => {
    dispatch({type:LOADING, flag:true})
    return post({
        url:'/traytracking/markCartAsComplete',
        data: {id:cartId},
    }).then((response) => {
        dispatch({type:LOADING, flag:false})
        dispatch({type:DELETE_CART, cartId, zone })
    }).catch((e) => {
        dispatch({type:LOADING, flag:false})
        console.log("Error while departing cart for zone "+zone+" : "+e)
    })
})

export const removeTrayFromCart =(cartId, zone, mealOrderId, history, isDeparted, isHighRiskTrayCheck) =>
((dispatch, getState) => {
    dispatch({type:LOADING, flag:true})
    return post({
        url:'/traytracking/removeTrayFromCart',
        data: {id:cartId, 
            mealOrderId
        },
    }).then((response) => {
        dispatch({type:LOADING, flag:false})
        if(isDeparted)
        {
            dispatch({type:REMOVE_TRAY_FROM_DEPART_CART, cartId, zone, mealOrderId});
            if(getState().departReducer.selectedCart.mealOrders.length < 1)
            {
                history.push('/departure');
            }
        }
        else if(isHighRiskTrayCheck)
        {
           dispatch({type:REMOVE_TRAY_FROM_HIGH_RISK_CHECK_CART, cartId, zone, mealOrderId});
            if(getState().departReducer.selectedCart.mealOrders.length < 1)
            {
                history.push('/highRiskTrayCheck');
            } 
        }
        else{
            dispatch({type:REMOVE_TRAY_FROM_CART, cartId, zone, mealOrderId})
        }
    }).catch((e) => {
        dispatch({type:LOADING, flag:false})
        console.log("Error while removing meal order from cart: "+e)
        dispatch({type:UNSELECT_MEAL_ORDER})

    })
})

export const selectMealOrder =(mealOrder) =>
((dispatch) => {
    dispatch({type:SELECT_MEAL_ORDER, mealOrder })
})

export const unselectMealOrder =() =>
((dispatch) => {
    dispatch({type:UNSELECT_MEAL_ORDER})
})

export const openInCartSummary = (selectedCart, selectedScreen, history) => ((dispatch) => {
    dispatch({type:LOADING, flag:false})
    dispatch({type:OPEN_INCART_SUMMARY, selectedCart, selectedScreen})
    history.push('/cartSummary');
})

export const closeAlertMessage = () =>
    ((dispatch) => {
        dispatch({type:CLOSE_ALERT_MESSAGE})
    })

export const updateSelectedSortBy = (sortByParam) => 
    ((dispatch) => {
        dispatch({type: UPDATE_SELECTED_SORT_BY, sortByParam})
        dispatch({type:FETCH_OUT_CART_ORDERS})
    })

export const updateSelectedMealName = (selectedMealName) => 
    ((dispatch) => {
        dispatch({type: UPDATE_SELECTED_MEAL_NAME, selectedMealName})
    })

    export const updateSelectedServiceStyle = (selectedServiceStyle) => 
    ((dispatch) => {
        dispatch({type: UPDATE_SELECTED_SERVICE_STYLE, selectedServiceStyle})
    })

export const updateSelectedKitchen = (selectedKitchen) => 
    ((dispatch) => {
        dispatch({type: UPDATE_SELECTED_KITCHEN, selectedKitchen})
    })

export const updateSelectedUnit = (selectedUnit) => 
    ((dispatch) => {
        dispatch({type: UPDATE_SELECTED_UNIT, selectedUnit})
    })

export const fetchFacilityMealNameArrayForSelectedFacility = () =>
{
    return (dispatch) => {
        dispatch({type:LOADING_SCREEN, loadingMealNames:true})
        return get({
            url:'/traytracking/fetchFacilityMealNamesForSelectedFacility',
        }).then((response) => {
            dispatch({type:LOADING_SCREEN, loadingMealNames:false})
            dispatch({type:FETCH_FACILITY_MEAL_NAMES, facilityMealNameArray:response.data})
        }).catch((e) => {
            dispatch({type:LOADING_SCREEN, loadingMealNames:false})
            console.log("Error while fetching meal names for facility: "+e)
        })             
    }
}

export const clearShortNameArray = (sortByParam) => 
    ((dispatch) => {
        dispatch({type: FETCH_FACILITY_MEAL_NAMES})
    })