import {
    LOADING,
    LOADING_SCREEN,
} from '../actions/Types';

export const initialState = {
    loadingOutCartMealOrders: false,
    loadingCarts: false,
    loadingMealNames: false,
    loadingMealOrdersAndCarts: false,
    loading: false,
    loadingKitchens: false,
    loadingServiceStyles: false,
    loadingUnits: false,
    loadingTrays: false,
    loadingRecovered: false,
    loadingIncart: false,
    loadingUnitDelivery: false,
    loadingDeliveredUnits: false,
    loadingUnitsToDeliver: false,
    loadingUnitRecovery: false,
    loadingRecoveredUnits: false,
    loadingDepartureScreen: false,
}

export default (state = initialState, action) => {

    switch(action.type) {
        case LOADING_SCREEN:
                var loadingCarts = action.loadingCarts !== undefined ? action.loadingCarts : state.loadingCarts
                var loadingOutCartMealOrders = action.loadingOutCartMealOrders !== undefined ? action.loadingOutCartMealOrders : state.loadingOutCartMealOrders
                var loadingKitchens = action.loadingKitchens !== undefined ? action.loadingKitchens : state.loadingKitchens
                var loadingServiceStyles = action.loadingServiceStyles !== undefined ? action.loadingServiceStyles : state.loadingServiceStyles
                var loadingUnits = action.loadingUnits !== undefined ? action.loadingUnits : state.loadingUnits
                var loadingMealNames = action.loadingMealNames !== undefined ? action.loadingMealNames : state.loadingMealNames
                var loadingIncart = loadingCarts || loadingOutCartMealOrders || loadingKitchens || loadingServiceStyles || loadingUnits || loadingMealNames
                var loadingRecoveredScreenMealOrders = action.loadingRecoveredScreenMealOrders !== undefined ? action.loadingRecoveredScreenMealOrders : state.loadingRecoveredScreenMealOrders
                var loadingRecovered = loadingRecoveredScreenMealOrders || loadingUnits
                var loadingMealOrdersAndCarts = loadingCarts || loadingOutCartMealOrders
                var loadingDeliveredUnits = action.loadingDeliveredUnits !== undefined ? action.loadingDeliveredUnits : state.loadingDeliveredUnits
                var loadingUnitsToDeliver = action.loadingUnitsToDeliver !== undefined ? action.loadingUnitsToDeliver : state.loadingUnitsToDeliver
                var loadingRecoveredUnits = action.loadingRecoveredUnits !== undefined ? action.loadingRecoveredUnits : state.loadingRecoveredUnits
                var loadingUnitDelivery = loadingKitchens || loadingMealNames || loadingUnitsToDeliver || loadingDeliveredUnits
                var loadingUnitRecovery = loadingKitchens || loadingMealNames || loadingRecoveredUnits || loadingDeliveredUnits
                var loadingDepartureScreen = loadingServiceStyles || loadingCarts;
            return {
                ...state,
                loadingIncart,
                loadingOutCartMealOrders,
                loadingKitchens,
                loadingServiceStyles,
                loadingUnits,
                loadingCarts,
                loadingMealOrdersAndCarts,
                loadingRecoveredScreenMealOrders,
                loadingRecovered,
                loadingUnitDelivery,
                loadingUnitRecovery,
                loadingDeliveredUnits,
                loadingRecoveredUnits,
                loadingUnitsToDeliver,
                loadingDepartureScreen,
            }
        case LOADING:
            return {
                ...state,
                loading: action.flag
            }
        default:
            return state;
    }

}
