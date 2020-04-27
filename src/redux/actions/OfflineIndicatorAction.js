import { 
    UPDATE_NETWORK_STATE,
 } from './Types';

export const windowOffline =() => 
((dispatch) => {
    dispatch({type:UPDATE_NETWORK_STATE, isOffline:true})
})

export const windowOnline =() => 
((dispatch) => {
    dispatch({type:UPDATE_NETWORK_STATE, isOffline:false})
})