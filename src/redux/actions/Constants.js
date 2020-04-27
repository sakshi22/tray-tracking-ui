//screen names
export const DELIVERED = "DELIVERED";
export const DEPARTED = "DEPARTED";
export const INCART_SCREEN_NAME = "Cart Loading"
export const ADD_TRAYS_SCREEN_NAME = "Add Trays"
export const DEPARTED_SCREEN_NAME = "Cart Departure"
export const DELIVERED_SCREEN_NAME = "Tray Delivery"
export const RECOVERED_SCREEN_NAME = "Tray Recovery"
export const CART_SUMMARY = "Cart Summary"
export const HIGH_RISK_TRAY_CHECK = "HIGH_RISK_TRAY_CHECK"
export const HIGH_RISK_TRAY_CHECK_SCREEN_NAME = "High Risk Tray Check"
export const UNIT_DELIVERY_TRACKING = "Unit Delivery Tracking"
export const UNIT_RECOVERY_TRACKING = "Unit Recovery Tracking"

//messages
export const NO_MORE_TRAYS = "No more available trays for selected criteria."
export const MARK_CART_DEPARTED = "Are you sure you want to mark this cart as departed?"
export const NEXT_ACTION_CONFIRMATION = "What would you like to do next?"
export const EMPTY_CART_DELETE_MESSAGE = "All trays added to this cart has been removed. Hence, the cart has been deleted. Please close the Cart Summary."
export const ALL_TRAYS_DELIVERED = "All trays delivered for selected criteria in this cart."
export const NO_CART_AVAILABLE = "No more carts available"
export const ERROR_WHILE_ADDING_MEAL_ORDERS = "Error while adding meal order!"
export const CART_FOR_ZONE_ALREADY_EXISTS = 'The Cart for this zone is already in use. Please refresh and try again with a cart for different zone.'
export const MEAL_ORDER_ALREADY_ADDED = 'This Meal Order is already added to a cart. Please refresh and try again with a different Meal Order.'
export const ERROR_WHILE_DEPARTING_CART = "Error while departing!"
export const ERROR_WHILE_DEPARTING_CART_MESSAGE = 'The Cart cannot be departed at this time. Please try again later.'
export const EMPTY_USERNAME_PASSWORD = 'Username and/or password cannot be empty.'
export const OFFLINE_RESPONSE_MESSAGE = 'Offline Response'
export const OFFLINE_MODE_ON_MESSAGE = "You're browsing in Offline Mode!"
export const ERROR_WHILE_OFFLINE_SWITCHING_FACILITY = "You're browsing in offline mode. You cannot switch facility right now. Please try again later when you're back online"
export const ERROR_WHILE_OFFLINE_SWITCHING_FACILITY_TITLE = "Cannot switch facility in offline mode!"
export const ERROR_WHILE_DELIVERING_UNIT = "Error while delivering unit!"
export const ERROR_WHILE_DELIVERING_UNIT_MESSAGE = "There is an error while trying to deliver this unit. Please try again after sometime."
export const ERROR_WHILE_UNDO_DELIVERING_UNIT = "Error while trying to undo deliver unit!"
export const ERROR_WHILE_UNDO_DELIVERING_UNIT_MESSAGE = "There is an error while trying to undo deliver this unit. Please try again after sometime."
export const MARK_DELIVERED = "Mark Delivered"
export const TAP_MEAL_TO_SELECT_UNIT_DELIVERED ="Tap Meal to view units to mark as Delivered" 
export const NO_MORE_UNITS_DELIVERED ="No more available units to mark delivered for selected criteria." 
export const ERROR_WHILE_RECOVERING_UNIT = "Error while recovering unit!"
export const ERROR_WHILE_RECOVERING_UNIT_MESSAGE = "There is an error while trying to recover this unit. Please try again after sometime."
export const ERROR_WHILE_UNDO_RECOVERING_UNIT = "Error while trying to undo recover unit!"
export const ERROR_WHILE_UNDO_RECOVERING_UNIT_MESSAGE = "There is an error while trying to undo recover this unit. Please try again after sometime."
export const MARK_RECOVERED = "Mark Recovered"
export const TAP_MEAL_TO_SELECT_UNIT_RECOVERED ="Tap Meal to view units to mark as Recovered" 
export const NO_MORE_UNITS_RECOVERED ="No more available units to mark recovered for selected criteria." 

//id constants
export const UNIT_ROOM_BED_SORT = "UNIT_ROOM_BED"
export const DELIVERY_DATE_TIME_SORT = "DELIVERY_DATE_TIME"
export const TICKET_NUMBER_SORT = "TICKET_NUMBER"
export const ZONE_NUMBER_SORT = "ZONE_NUMBER"
export const UNIT = "unit"
export const SERVICE_STYLE = "serviceStyle"
export const BUILD_AREA = "buildArea"
export const SORT_BY = "sortBy"
export const MEAL_NAME = "mealName"
export const DELIVERED_STATUS = "DELIVERED"
export const RECOVERED_STATUS = "RECOVERED"
export const DEPARTED_STATUS = "DEPARTED"
export const SEARCH = "search"
export const NUMBER = "number"

//labels
export const UNIT_ROOM_BED_SORT_LABEL = "Sort By Unit/Room/Bed"
export const TIME_SINCE_DELIVERED_SORT_LABEL = "Sort By Time since Delivered"
export const DELIVERY_TIME_SORT_LABEL = "Sort By Delivery Time"
export const TICKET_NUMBER_SORT_LABEL = "Sort By Ticket #"
export const ZONE_NUMBER_SORT_LABEL = "Sort By Zone #"
export const SHOW_ALL_UNITS = "Show All Units"
export const SHOW_ALL_BUILD_AREAS = "Show All Build Areas"
export const SHOW_ALL_SERVICE_STYLES = "Show All Service Styles"
export const SHOW_ALL_MEALS = "Show All Meals"
export const SEARCH_LABEL = "Search for Tray"
export const SEARCH_LABEL_TRAY_NUMBERS = "Search for Tray Ticket #"
export const NOW = "NOW"
export const RUSH = "RUSH"
export const START_DELIVERING_TRAYS = "Start Delivering Trays"
export const RETURN_TO_DEPARTED = "Return to Departed"
export const LOAD_NEW_TRAYS = "Load New Trays"
export const BEDSIDE = "BEDSIDE"
export const ROOM_SERVICE = "ROOM_SERVICE"

//constant array
export const INCART_SORT_BY_OPTION_ARRAY = [{ id: DELIVERY_DATE_TIME_SORT, name: DELIVERY_TIME_SORT_LABEL }, 
                                    { id: TICKET_NUMBER_SORT, name: TICKET_NUMBER_SORT_LABEL },
                                    { id: UNIT_ROOM_BED_SORT, name: UNIT_ROOM_BED_SORT_LABEL },
                                    { id: ZONE_NUMBER_SORT, name: ZONE_NUMBER_SORT_LABEL}]