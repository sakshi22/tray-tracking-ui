 
 import {
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGOUT,
    FACILITY_CHANGE_SUCCESS
 } from '../actions/Types';
 
 export const initialState = {
    userName: "",
    password: "",
    isAuthenticated:false,
    errorMessage:'',
    defaultFacilityName : sessionStorage.getItem("facilityName")
 };

 export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {...state, isAuthenticated:true, defaultFacilityName: action.data.facilityName, errorMessage:undefined}
        case LOGIN_FAILED:
            return {...state, isAuthenticated:false, errorMessage:action.errorMessage }
        case LOGOUT:
            return initialState
        case FACILITY_CHANGE_SUCCESS:
            return {...state,  defaultFacilityName: action.facilityName }
        default: 
            return state;
    }    
 }  