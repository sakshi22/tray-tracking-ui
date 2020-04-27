import {get, post} from '../../services/httpService';
import { READY_TO_DELIVER_CARTS,
    UPDATE_DELIVERED_SUCCESS,
    UPDATE_UNDO_DELIVERED_SUCCESS, 
    LOADING
 } from './Types';

export const fetchReadyToDeliverCarts = () => ((dispatch) => {
    dispatch({type:LOADING, flag:true})
    return get({
        url : '/traytracking/fetchReadyToDeliverCarts',
    }).then((res) => {       
        dispatch({type:READY_TO_DELIVER_CARTS, data: res.data});
        dispatch({type:LOADING, flag:false})
    }).catch((e) => {
       console.log('Error while fetching ready to deliver carts.')
       dispatch({type:LOADING, flag:false})
    })
})

export const markTrayDelivered = (selectedMealOrder, selectedCart, unitId, sortBy) => ((dispatch) => {
    dispatch({type:LOADING, flag:true})
    return post({
        url:'/traytracking/markTrayAsDelivered',
        data:{id: selectedMealOrder.id}
    }).then((res) => {
        dispatch({type:LOADING, flag:false})
        dispatch({type:UPDATE_DELIVERED_SUCCESS, selectedMealOrder, selectedCart, unitId, sortBy });
    }).catch((err) => {
        dispatch({type:LOADING, flag:false})
        console.log('Error while marking tray delivered.')
    })
})

export const undoDeliveredTray =(selectedCart, selectedMealOrder, unitId, sortBy) => {
    return (dispatch) => {
        dispatch({type:LOADING, flag:true})
    return post({
            url:'/traytracking/undoDeliveredMealOrder',
            data: {id:selectedMealOrder.id},
        }).then((response) => {
            dispatch({type:LOADING, flag:false})
            dispatch({type:UPDATE_UNDO_DELIVERED_SUCCESS, selectedMealOrder, selectedCart, unitId, sortBy});
        }).catch((e) => {
            console.log("Error while trying to undo recovered tray: "+e)
            dispatch({type:LOADING, flag:false})
        })
    }
}
