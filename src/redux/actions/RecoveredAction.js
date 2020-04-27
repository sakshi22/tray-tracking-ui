import {
    FETCH_TRAYS_TO_RECOVER,
    UNSELECT_MEAL_ORDER,
    LOADING_SCREEN,
} from './Types';
import { get, post } from '../../services/httpService';
import { RECOVERED_STATUS, DELIVERED_STATUS } from './Constants';

export const fetchTraysToRecover = (unitId, sortBy, isOffline) => {
    return (dispatch) => {
        dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: true })
        var originalUnitId, originalSortBy
        if (isOffline) {
            originalUnitId = unitId
            originalSortBy = sortBy
            unitId = -1
            sortBy = ''
        }
        return get({
            url: '/traytracking/fetchDeliveredMealOrders/?unitId=' + unitId,
        }).then((response) => {
            if (isOffline)
                dispatch({ type: FETCH_TRAYS_TO_RECOVER, traysToBeRecovered: response.data, unitId: originalUnitId, sortBy: originalSortBy, isOffline })
            else
                dispatch({ type: FETCH_TRAYS_TO_RECOVER, traysToBeRecovered: response.data, unitId, sortBy, isOffline })
            dispatch({ type: UNSELECT_MEAL_ORDER })
            dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: false })
        }).catch((e) => {
            console.log("Error while fetching recovered trays: " + e)
            dispatch({ type: UNSELECT_MEAL_ORDER })
            dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: false })
        })
    }
}

export const recoverTray = (isOffline, mealOrderId, unitId, sortBy) => {
    return (dispatch) => {
        dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: true })
        return post({
            url: '/traytracking/recoverMealOrder',
            data: { id: mealOrderId },
        }).then((response) => {

            dispatch(fetchTraysToRecover(unitId, sortBy, isOffline, mealOrderId, RECOVERED_STATUS))
            dispatch({ type: UNSELECT_MEAL_ORDER })
            dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: false })
        }).catch((e) => {
            console.log("Error while recovering tray: " + e)
            dispatch({ type: UNSELECT_MEAL_ORDER })
            dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: false })
        })
    }
}

export const undoRecoveredTray = (isOffline, mealOrderId, unitId, sortBy) => {
    return (dispatch) => {
        dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: true })
        return post({
            url: '/traytracking/undoRecoveredMealOrder',
            data: { id: mealOrderId },
        }).then((response) => {
            dispatch(fetchTraysToRecover(unitId, sortBy, isOffline, mealOrderId, DELIVERED_STATUS))
            dispatch({ type: UNSELECT_MEAL_ORDER })
            dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: false })
        }).catch((e) => {
            console.log("Error while trying to undo recovered tray: " + e)
            dispatch({ type: LOADING_SCREEN, loadingRecoveredScreenMealOrders: false })
        })
    }
}
