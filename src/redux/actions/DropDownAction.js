import { FETCH_FACILITY_SUCCESS, SAVE_FACILITY_SUCCESS,
    CLOSE_FACILITY_POPUP, FACILITY_CHANGE_SUCCESS, LOADING, OFFLINE_SWITCH_FACILITY, CLEAR_INCART_FILTERS, CLEAR_UNIT_DELIVERY_FILTER } from './Types';
import {get, post} from '../../services/httpService';

export const switchFacility = (isOffline) => {
    return (dispatch) => {
        if(isOffline){
            dispatch({type: OFFLINE_SWITCH_FACILITY})
        }
        else{
            dispatch({type:LOADING, flag:true})
            return get({
                url:'/traytracking/fetchAssignedFacilities',
            }).then((response) => {
                dispatch({type:LOADING, flag:false})
                dispatch({type:FETCH_FACILITY_SUCCESS, data:response.data})
                }).catch((e) => {
        	        dispatch({type:LOADING, flag:false})
                })   
        }          
    }
}

export const saveDafaultFacility = (facility, history) => ((dispatch) => {
    dispatch({type:LOADING, flag:true})
    return post({
        url:'/traytracking/saveDafaultFacility',
        data: {id:facility.id},
    }).then((response) => {
		dispatch({type:LOADING, flag:false})
		sessionStorage.setItem("facilityName", facility.name);        
		dispatch({type:SAVE_FACILITY_SUCCESS, facility});
        dispatch({type:FACILITY_CHANGE_SUCCESS, facilityName:facility.name})
        dispatch({type: CLEAR_INCART_FILTERS})
        dispatch({type:CLEAR_UNIT_DELIVERY_FILTER})
        history.push('/trayEvents');
    }).catch((e) => {
        dispatch({type:LOADING, flag:false})
    })
})

export const handleClose = () => {
    return ((dispatch) => {
        dispatch({type:CLOSE_FACILITY_POPUP})
    })
}