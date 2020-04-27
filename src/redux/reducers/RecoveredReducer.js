import {
  FETCH_TRAYS_TO_RECOVER,
} from "../actions/Types";
import { DELIVERED_STATUS} from "../actions/Constants";
import { sortOn } from '../../utils/sort'
export const initialState = {
  traysToBeRecovered: [],
  recoveredTrays: [],
};


export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRAYS_TO_RECOVER:  {
      var trays = action.traysToBeRecovered
      var combinedList = createRecoveredAndUndoLists(trays)
      var traysToBeRecovered = combinedList[0]
      var recoveredTrays = combinedList[1]
      if (action.isOffline) {
        if (action.unitId !== -1) {
          traysToBeRecovered = traysToBeRecovered.filter(item => item.unitId === action.unitId)
          recoveredTrays = recoveredTrays.filter(item => item.unitId === action.unitId)
        }
      }
      traysToBeRecovered.sort(sortOn(action.sortBy, true))
      recoveredTrays.sort(sortOn(action.sortBy, true))
      return {
        ...state,
        traysToBeRecovered,
        recoveredTrays,
      };
    }
    default:
      return state;
  }
}

function getTimeFromDelivery(deliveredDateTime) {

  var diffMs = (new Date() - Date.parse(deliveredDateTime)); // milliseconds between now & Christmas
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  return diffMins
}

function createRecoveredAndUndoLists(trays) {
  var recoveredTrays = []
  var traysToBeRecovered = []
  if (trays && trays.length > 0) {
    trays.forEach(tray => {
      if (tray != null) {
        if (tray.trackingStatus === DELIVERED_STATUS) {
          if (tray.deliveredDateTime) {
            tray.timeFromDelivery = getTimeFromDelivery(tray.deliveredDateTime)
          }
          traysToBeRecovered.push(tray)
        }
        else {
          tray.isUndoEnable = true;
          recoveredTrays.push(tray)
        }
      }
    });
  }
  return [traysToBeRecovered, recoveredTrays];
}