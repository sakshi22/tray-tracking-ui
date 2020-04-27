import { UNIT_ROOM_BED_SORT , DELIVERY_DATE_TIME_SORT, TICKET_NUMBER_SORT } from "../redux/actions/Constants";
export function sortOn(sortByParam, isRecovered, inCart) {
    if(inCart){
        return sortIncartOrders(sortByParam);
    } else if (isRecovered) {
        return sortByTimeSinceDelivery()
    } else if (sortByParam === UNIT_ROOM_BED_SORT) {
        return sortByURB()
    }  else if (sortByParam!== UNIT_ROOM_BED_SORT && !isRecovered && !inCart){
        return sortByDeliveryTime()
    }
}
function sortByURB(isInCart) {
    return function (a, b) {
        if(isInCart){
            var sortByRush = sortByRushOrder(a,b)
            if(sortByRush !== 0){
                return sortByRush
            }
        }
        return sortingByURBAndTicketNum(a, b);
    }
}

function sortByDeliveryTime(isInCart) {
    return function (a, b) {
        if(isInCart){
            var sortByRush = sortByRushOrder(a,b)
            if(sortByRush !== 0){
                return sortByRush
            }
        }
        if (a.deliveryDateTime === b.deliveryDateTime)
            return sortingByURBAndTicketNum(a, b);
        return new Date(a.deliveryDateTime) - new Date(b.deliveryDateTime)
    }
}

function sortByTicketNumber(isInCart) {
    return function (a, b) {
        if(isInCart){
            var sortByRush = sortByRushOrder(a,b)
            if(sortByRush !== 0){
                return sortByRush
            }
        }
        if (a.ticketNumber === b.ticketNumber)
            return sortByDeliveryTime(a, b);
        return parseInt(a.ticketNumber) - parseInt(b.ticketNumber)
        
    }
}
function sortByZone(isInCart) {
    return function (a, b) {
        if(isInCart){
            var sortByRush = sortByRushOrder(a,b)
            if(sortByRush !== 0){
                return sortByRush
            }
        }
        if (a.zone === b.zone)
            return sortByDeliveryTime(a, b);
        return parseInt(a.zone) - parseInt(b.zone)
    }
}

function sortIncartOrders(param) {
    if (param === DELIVERY_DATE_TIME_SORT) {
        return sortByDeliveryTime(true)
    } else if (param === UNIT_ROOM_BED_SORT) {
        return sortByURB(true)
    } else if (param === TICKET_NUMBER_SORT) {
        return sortByTicketNumber(true)
    } else { //zone number
        return sortByZone(true)
    }
}

function sortByRushOrder(a,b){
    if (a.rushOrder === true && b.rushOrder === false) {
        return -1;
    } 
    else if (a.rushOrder === false && b.rushOrder === true) {
        return 1;
    } 
    else if (a.rushOrder === true && b.rushOrder === true) {
       if(a.deliveryDateTime === b.deliveryDateTime){
        return 1;
        }
        return new Date(a.deliveryDateTime) - new Date(b.deliveryDateTime);
    } 
    else {
        return 0; 
    }
}

function sortByTimeSinceDelivery() {
    return function (a, b) {
      var diff = b.timeFromDelivery - a.timeFromDelivery
      if (diff !== 0) {
        return diff;
      } else {
        return a.ticketNumber - b.ticketNumber
      }
    }
  }  

function sortingByURBAndTicketNum(a, b) {
    if (a.unitName.toUpperCase() > b.unitName.toUpperCase()) {
        return 1
    } else if (a.unitName.toUpperCase() === b.unitName.toUpperCase()) {
        if (a.roomName.toUpperCase() > b.roomName.toUpperCase()) {
            return 1
        } else if (a.roomName.toUpperCase() === b.roomName.toUpperCase()) {
            if (a.bedName.toUpperCase() > b.bedName.toUpperCase()) {
                return 1
            } else if (a.bedName.toUpperCase() === b.bedName.toUpperCase()) {
                return a.ticketNumber - b.ticketNumber
            } else {
                return -1
            }
        } else {
            return -1
        }
    } else {
        return -1
    }
} 

