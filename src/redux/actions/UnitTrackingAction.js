import { get, post } from '../../services/httpService';
import {
    LOADING,
    FETCH_DELIVERY_OR_RECOVERY_UNITS,
    UPDATE_UNIT_UNDO_DELIVERED_FAIL,
    UPDATE_UNIT_DELIVERED_FAIL,
    RESET_UNIT_DELIVERY_FAIL_PARAMETERS,
    LOADING_SCREEN,
    UPDATE_SELECTED_KITCHEN_FOR_UNIT_DELIVERY,
    UPDATE_SELECTED_KITCHEN_FOR_UNIT_RECOVERY,
    FETCH_KITCHENS
} from './Types';


export const fetchKitchensWithUnitTrackingEnabled = () => {
    return (dispatch) => {
        dispatch({type:LOADING_SCREEN, loadingKitchens:true})
        return get({
            url:'/traytracking/fetchKitchensWithUnitTrackingEnabled'
        }).then((response)=>{
            dispatch({type:FETCH_KITCHENS, kitchens:response.data })
            dispatch({type:LOADING_SCREEN, loadingKitchens:false})
        }).catch((e)=>{
            console.log("Error while fetching kitchens: "+e)
            dispatch({type:LOADING_SCREEN, loadingKitchens:false})
        })       
    }
}

export const fetchDeliveryUnits = (kitchenId, mealNameId) => ((dispatch) => {
    dispatch({ type: LOADING_SCREEN, loadingUnitsToDeliver: true })
    return get({
        url: '/traytracking/fetchDeliveryUnits/?mealNameId=' + mealNameId + '&kitchenId=' + kitchenId,
    }).then((res) => {
        dispatch({ type: FETCH_DELIVERY_OR_RECOVERY_UNITS, units: res.data, });
        dispatch({ type: LOADING_SCREEN, loadingUnitsToDeliver: false })
    }).catch((e) => {
        console.log('Error while fetching units to mark deliver.')
        dispatch({ type: LOADING_SCREEN, loadingUnitsToDeliver: false })
    })
})

export const markUnitForTracking = (selectedUnit, selectedMealNameId, selectedKitchen, isDelivery) => ((dispatch) => {
    dispatch({ type: LOADING, flag: true })
    return post({
        url: '/traytracking/markUnit',
        data: {
            id: selectedUnit.id,
            kitchenId: selectedKitchen,
            mealNameId: selectedMealNameId,
            eventType: isDelivery ? 'Delivered' : 'Recovered'
        }
    }).then((res) => {
        dispatch({ type: LOADING, flag: false })
        dispatch({ type: FETCH_DELIVERY_OR_RECOVERY_UNITS, units: res.data, });
    }).catch((err) => {
        dispatch({ type: UPDATE_UNIT_DELIVERED_FAIL });
        dispatch({ type: LOADING, flag: false })
        console.log('Error while marking unit '+ isDelivery ? 'delivered.' : 'recovered.')
    })
})

export const undoUnitTracking = (selectedUnit, selectedMealNameId, selectedKitchen, isDelivery) => ((dispatch) => {
    dispatch({ type: LOADING, flag: true })
    return post({
        url: '/traytracking/undoMarkedUnit',
        data: {
            umsId: selectedUnit.umsId,
            kitchenId: selectedKitchen,
            mealNameId: selectedMealNameId,
            eventType: isDelivery ? 'Delivered' : 'Recovered'
        }
    }).then((res) => {
        dispatch({ type: LOADING, flag: false })
        dispatch({ type: FETCH_DELIVERY_OR_RECOVERY_UNITS, units: res.data, });
    }).catch((err) => {
        dispatch({ type: UPDATE_UNIT_UNDO_DELIVERED_FAIL });
        dispatch({ type: LOADING, flag: false })
        console.log('Error while marking unit '+ isDelivery ? 'delivered.' : 'recovered.')
    })
})

export const fetchRecoveryUnits = (kitchenId, mealNameId) => ((dispatch) => {
    dispatch({ type: LOADING_SCREEN, loadingRecoveredUnits: true })
    return get({
        url: '/traytracking/fetchRecoveryUnits/?mealNameId=' + mealNameId + '&kitchenId=' + kitchenId,
    }).then((res) => {
        dispatch({ type: FETCH_DELIVERY_OR_RECOVERY_UNITS, units: res.data, });
        dispatch({ type: LOADING_SCREEN, loadingRecoveredUnits: false })
    }).catch((e) => {
        console.log('Error while fetching units to mark recover.')
        dispatch({ type: LOADING_SCREEN, loadingRecoveredUnits: false })
    })
})

export const resetUnitDeliveryFailureParameters = () => ((dispatch) => {
    dispatch({ type: RESET_UNIT_DELIVERY_FAIL_PARAMETERS })
}
)

export const updateSelectedKitchenForUnitDelivery = (selectedKitchen) => ((dispatch) => {
    dispatch({ type: UPDATE_SELECTED_KITCHEN_FOR_UNIT_DELIVERY, selectedKitchen })
}
)

export const updateSelectedKitchenForUnitRecovery = (selectedKitchen) => ((dispatch) => {
    dispatch({ type: UPDATE_SELECTED_KITCHEN_FOR_UNIT_RECOVERY, selectedKitchen })
}
)