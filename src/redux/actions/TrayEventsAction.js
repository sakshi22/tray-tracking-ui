import { LOADING, GET_UNIT_DELIVERY_INITIAL_STATE } from "./Types";

export const goToInCart =(history) => 
((dispatch) => {
    dispatch({type:LOADING, flag:false})
    history.push('/inCart');
});

export const goToUnitDeliveryTracking =(history) => 
((dispatch) => {
    dispatch({type:GET_UNIT_DELIVERY_INITIAL_STATE})
    dispatch({type:LOADING, flag:false})
    history.push('/unitDeliveryTracking');
});

export const goToUnitRecoveryTracking =(history) =>
((dispatch) => {
    dispatch({type:GET_UNIT_DELIVERY_INITIAL_STATE})
    dispatch({type:LOADING, flag:false})
    history.push('/unitRecoveryTracking')
})

export const openReadyToDepart = (history) =>
((dispatch) => {
    history.push('/departure');
})

export const goToTrayEvents =(history) => 
((dispatch) => {
    dispatch({type:LOADING, flag:false})
    history.push('/trayEvents');
});

export const openReadyToDeliver = (history) => 
((dispatch) => {
    history.push('/delivered');
})

export const openRecovered = (history) => 
((dispatch) => {
    history.push('/recovered');
})

export const openReadyToHighRiskTrayCheck = (history) =>
((dispatch) => {
    history.push('/highRiskTrayCheck');
})