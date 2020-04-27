import {get, post} from '../../services/httpService';
import {LOADING,
    READY_TO_HIGH_RISK_TRAY_CHECK_CARTS,
    MARK_CART_CHECKED_SUCCESS,
    HIDE_ERROR_MESSAGE,
    FILTER_HIGH_RISK_CARTS,
    FETCH_HIGH_RISK_SERVICE_STYLES_KITCHENS,
    HIGH_RISK_FILTER_KITCHENS,
    LOADING_SCREEN} from './Types';

export const fetchReadyToHighRiskCheckCarts =  () => ((dispatch) => {
    dispatch({type:LOADING, flag:true})
    return get({
        url : '/traytracking/fetchReadyToHighRiskCheckCarts'
    }).then((res) => {
        dispatch({type:READY_TO_HIGH_RISK_TRAY_CHECK_CARTS, data: res.data});
        dispatch({type:LOADING, flag:false})
    }).catch((e) => {
        console.log("Error while fetching ready to high risk carts.")
        dispatch({type:LOADING, flag:false})
    })
})

export const markCartChecked = (cart, history) => ((dispatch) => {
    dispatch({type:LOADING, flag:true})
    return post({
        url:'/traytracking/markCartChecked',
        data: {id:cart.id}
    }).then((res) => {
        dispatch({type:LOADING, flag:false})
        dispatch({type:MARK_CART_CHECKED_SUCCESS, status: true});
		history.push('/highRiskTrayCheck');
    }).catch((e) => {
        dispatch({type:MARK_CART_CHECKED_SUCCESS, status: false});
        dispatch({type:LOADING, flag:false})
    })
})

export const hideErrorPopup = () => ((dispatch) => {
    dispatch({type:HIDE_ERROR_MESSAGE})
})


export const filterCarts = (selectedServiceStyle, selectedKitchenId, searchText) => ((dispatch) => {
    dispatch({type:FILTER_HIGH_RISK_CARTS, selectedServiceStyle, selectedKitchenId, searchText})
})
