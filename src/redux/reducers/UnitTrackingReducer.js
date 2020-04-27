import {
  FETCH_DELIVERY_OR_RECOVERY_UNITS,
  UPDATE_UNIT_DELIVERED_FAIL,
  UPDATE_UNIT_UNDO_DELIVERED_FAIL,
  RESET_UNIT_DELIVERY_FAIL_PARAMETERS,
  UPDATE_SELECTED_KITCHEN_FOR_UNIT_DELIVERY,
  UPDATE_SELECTED_KITCHEN_FOR_UNIT_RECOVERY,
  GET_UNIT_DELIVERY_INITIAL_STATE,
  CLEAR_UNIT_DELIVERY_FILTER
} from "../actions/Types";


export const initialState = {
  unitsToDeliver: [],
  deliveredUnits: [],
  recoveredUnits: [],
  undoDeliveredFail: false,
  deliveredFail: false,
  selectedKitchenDelivered: -1,
  selectedKitchenRecovered: -1,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DELIVERY_OR_RECOVERY_UNITS: {
      var deliveredUnits = [];
      var unitsToDeliver = [];
      var recoveredUnits = [];
      action.units.forEach(unit => {
        if (unit.umsId == null) {
          unitsToDeliver.push(unit)
        } else if (unit.eventType === 'Delivered') {
          deliveredUnits.push(unit)
        } else if (unit.eventType === 'Recovered') {
          recoveredUnits.push(unit)
        }
      });
      return {
        ...state,
        unitsToDeliver,
        deliveredUnits,
        recoveredUnits,
      };
    }
    case UPDATE_UNIT_UNDO_DELIVERED_FAIL:
      return {
        ...state,
        undoDeliveredFail: true
      }
    case UPDATE_UNIT_DELIVERED_FAIL:
      return {
        ...state,
        deliveredFail: true
      }
    case RESET_UNIT_DELIVERY_FAIL_PARAMETERS:
      return {
        ...state,
        undoDeliveredFail: false,
        deliveredFail: false,
      }
    case UPDATE_SELECTED_KITCHEN_FOR_UNIT_DELIVERY:
      return {
        ...state,
        selectedKitchenDelivered: action.selectedKitchen
      }
    case UPDATE_SELECTED_KITCHEN_FOR_UNIT_RECOVERY:
      return {
        ...state,
        selectedKitchenRecovered: action.selectedKitchen
      }
    case CLEAR_UNIT_DELIVERY_FILTER:
      return {
        ...state,
        selectedKitchenDelivered: -1,
        selectedKitchenRecovered: -1,
      }
    case GET_UNIT_DELIVERY_INITIAL_STATE:
      return {
        ...state,
        unitsToDeliver: [],
        deliveredUnits: [],
        recoveredUnits: [],
        undoDeliveredFail: false,
        deliveredFail: false,
      }
    default:
      return state;
  }
}
