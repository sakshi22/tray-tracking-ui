import {
    UPDATE_NETWORK_STATE
 } from '../actions/Types';
 
 export const initialState = {
    isOffline: false,
 };

 export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_NETWORK_STATE:
            return {...state, isOffline:action.isOffline,}
        default: 
            return state;
    }    
 }  