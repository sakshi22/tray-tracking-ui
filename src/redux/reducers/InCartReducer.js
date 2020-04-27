import {
  FETCH_OUT_CART_ORDERS,
  SELECT_MEAL_ORDER,
  FETCH_SERVICE_STYLES,
  FETCH_KITCHENS,
  FETCH_UNITS,
  ADD_TO_CART,
  FETCH_CARTS,
  REMOVE_TRAY_FROM_CART,
  DELETE_CART,
  UNSELECT_MEAL_ORDER,
  REMOVE_ADDED_OUT_CART_ORDERS,
  OPEN_INCART_SUMMARY,
  SHOW_CART_ALREADY_EXISTS_MESSAGE,
  CLOSE_ALERT_MESSAGE,
  REMOVE_FROM_OUT_CART_ORDERS,
  UPDATE_SELECTED_SORT_BY,
  FETCH_FACILITY_MEAL_NAMES,
  CLEAR_INCART_FILTERS,
  UPDATE_SELECTED_MEAL_NAME,
  UPDATE_SELECTED_UNIT,
  UPDATE_SELECTED_KITCHEN,
  UPDATE_SELECTED_SERVICE_STYLE,
  FILTER_OUT_CART_ORDERS,
} from "../actions/Types";
import { MEAL_ORDER_ALREADY_ADDED, CART_FOR_ZONE_ALREADY_EXISTS, BEDSIDE, UNIT_ROOM_BED_SORT, DELIVERY_DATE_TIME_SORT, SHOW_ALL_MEALS } from "../actions/Constants";
import { sortOn } from '../../utils/sort'
export const initialState = {
  serviceStyles: [],
  kitchens: [],
  units: [],
  outOfCartOrders: [],
  outCartOrderMasterList: [],
  carts: [],
  addToCart: false,
  selectedOrderTicket: '',
  showCartSummary: true,
  showAlertMessage: false,
  selectedSortBy: DELIVERY_DATE_TIME_SORT,
  selectedMealName: -1,
  selectedUnit: -1,
  selectedServiceStyle: -1,
  selectedKitchen: -1,
  facilityMealNameArray: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SERVICE_STYLES: {
      let serviceStyles = action.serviceStyles;
      return {
        ...state,
        serviceStyles,
      };
    }
    case FETCH_KITCHENS: {
      let kitchens = action.kitchens;
      return {
        ...state,
        kitchens,
      };
    }
    case FETCH_UNITS: {
      let units = action.units;
      return {
        ...state,
        units,
      };
    }
    case FETCH_FACILITY_MEAL_NAMES: {
      let facilityMealNames = action.facilityMealNameArray
      let facilityMealNameArray = []
      facilityMealNameArray.push({id:-1, name: SHOW_ALL_MEALS})
      facilityMealNames.forEach((meal)=> {
        facilityMealNameArray.push({id:meal.mealNameId, name: meal.name})
      })
      return {
        ...state,
        facilityMealNameArray: facilityMealNameArray,
      }
    }
    case CLEAR_INCART_FILTERS: {
      return {
        ...state,
        facilityMealNameArray: undefined,
        selectedServiceStyle: -1,
        selectedKitchen: -1,
        selectedUnit: -1,
        selectedSortBy: DELIVERY_DATE_TIME_SORT,
        selectedMealName: -1,
      }
    }
    case UPDATE_SELECTED_SORT_BY: {
      return {
        ...state,
        selectedSortBy: action.sortByParam,
      };
    }
    case UPDATE_SELECTED_MEAL_NAME: {
      return {
        ...state,
        selectedMealName: action.selectedMealName,
      };
    }
    case UPDATE_SELECTED_SERVICE_STYLE: {
      return {
        ...state,
        selectedServiceStyle: action.selectedServiceStyle,
      };
    }
    case UPDATE_SELECTED_KITCHEN: {
      return {
        ...state,
        selectedKitchen: action.selectedKitchen,
      };
    }
    case UPDATE_SELECTED_UNIT: {
      return {
        ...state,
        selectedUnit: action.selectedUnit,
      };
    }
    case FETCH_OUT_CART_ORDERS: {
      var outOfCartOrders = action.outOfCartOrders ? action.outOfCartOrders : state.outOfCartOrders;
      let selectedMealOrder = undefined;
      if (outOfCartOrders !== []) {
        outOfCartOrders = outOfCartOrders.sort(sortOn(state.selectedSortBy, false, true));
      }
      return {
        ...state,
        selectedMealOrder,
        outOfCartOrders,
        outCartOrderMasterList: outOfCartOrders,
      };
    }
    case FILTER_OUT_CART_ORDERS: {
      let selectedMealOrder = undefined;
      var searchText = action.searchText.toLowerCase().trim();
      if (searchText !== '') {
        outOfCartOrders = state.outCartOrderMasterList.filter((mo) => {
          return (mo.ticketNumber.toString().includes(searchText)
            || mo.unitName.toLowerCase().includes(searchText)
            || mo.roomName.toLowerCase().includes(searchText)
            || mo.bedName.toLowerCase().includes(searchText))
        });
      } else {
        outOfCartOrders = state.outCartOrderMasterList
      }
      return {
        ...state,
        selectedMealOrder,
        outOfCartOrders,
      };
    }
    case SHOW_CART_ALREADY_EXISTS_MESSAGE: {
      return {
        ...state,
        showAlertMessage: true,
        alertMessage: CART_FOR_ZONE_ALREADY_EXISTS,
      }
    }
    case CLOSE_ALERT_MESSAGE: {
      return {
        ...state,
        showAlertMessage: false,
      }
    }
    case FETCH_CARTS: {
      var responseCarts = action.responseCarts;
      let noOfZones = 20;
      let carts = [];
      carts.length = noOfZones;
      for (var i = 0; i < noOfZones; i++) {
        if (responseCarts[i] !== undefined) {
          carts[responseCarts[i].zone - 1] = responseCarts[i];
          if (i !== responseCarts[i].zone - 1 && carts[i] === undefined) {
            var cart = {
              zone: (i + 1).toString(),
            }
            carts[i] = cart
          }
        }
        else {
          if (carts[i] === undefined) {
            cart = {
              zone: (i + 1).toString(),
            }
            carts[i] = cart
          }
        }
      }
      return {
        ...state,
        carts,
      };
    }
    case SELECT_MEAL_ORDER: {
      var selectedMealOrder = action.mealOrder;
      return {
        ...state,
        selectedMealOrder,
      };
    }
    case REMOVE_FROM_OUT_CART_ORDERS: {
      outOfCartOrders = state.outOfCartOrders.filter(item => item.id !== action.mealOrderId)
      selectedMealOrder = undefined;
      return {
        ...state,
        outOfCartOrders,
        selectedMealOrder,
        showAlertMessage: true,
        alertMessage: MEAL_ORDER_ALREADY_ADDED,
      };
    }
    case ADD_TO_CART: {
      if (action.hasMealOrders) {
        cart = state.carts.filter(item => item.id === action.cartId)[0]
        cart.mealOrders = [state.selectedMealOrder, ...cart.mealOrders];
      } else {
        cart = state.carts.filter(item => item.zone === action.zone)[0]
        cart.id = action.cartId;
        cart.mealOrders = [];
        cart.mealOrders.push(state.selectedMealOrder);
      }
      state.carts.splice(action.zone - 1, 1, cart);
      let outOfCartOrders = state.outOfCartOrders;
      outOfCartOrders = outOfCartOrders.filter(item => item.id !== state.selectedMealOrder.id)
      selectedMealOrder = undefined;
      return {
        ...state,
        outOfCartOrders,
        selectedMealOrder,
        outCartOrderMasterList: outOfCartOrders,
      };
    }
    case UNSELECT_MEAL_ORDER: {
      selectedMealOrder = undefined;
      return {
        ...state,
        selectedMealOrder,
      };
    }
    case REMOVE_TRAY_FROM_CART: {
      var selectedCart = Object.assign({}, state.selectedCart);
      var showCartSummary = state.showCartSummary
      selectedCart.mealOrders = selectedCart.mealOrders.filter(item => item.id !== action.mealOrderId)
      if (selectedCart.mealOrders.length < 1) {
        selectedCart = undefined;
        showCartSummary = false;
      }
      return {
        ...state,
        selectedCart,
        showCartSummary
      };
    }
    case OPEN_INCART_SUMMARY:
      selectedCart = action.selectedCart
      return {
        ...state,
        selectedCart,
        showCartSummary: true,
        selectedScreen: action.selectedScreen,
      }
    case DELETE_CART: {
      selectedCart = undefined
      return {
        ...state,
        selectedCart,
        showCartSummary: false,
      };
    }
    case REMOVE_ADDED_OUT_CART_ORDERS: {
      outOfCartOrders = state.outOfCartOrders.filter(item => item.id !== action.mealOrderId)
      let selectedMealOrder = undefined;
      return {
        ...state,
        outOfCartOrders,
        selectedMealOrder,
      };
    }
    default:
      return state;
  }
};
