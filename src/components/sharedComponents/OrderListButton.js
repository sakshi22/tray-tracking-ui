import React, { Component } from "react";
import { connect } from 'react-redux';
import { removeTrayFromCart, fetchAllUnitsForSelectedKitchen, unselectMealOrder, selectMealOrder } from '../../redux/actions/InCartAction';
import { markCartDeparted, sortAndFilterTrays, openDepartedCartSummary, hideConfirmationPopup } from '../../redux/actions/DepartureAction';
import { markTrayDelivered, undoDeliveredTray } from '../../redux/actions/DeliveredAction';
import { fetchTraysToRecover, recoverTray, undoRecoveredTray} from '../../redux/actions/RecoveredAction';
import { openReadyToDepart } from '../../redux/actions/TrayEventsAction'
import CustomizedDialogs from './CustomizedDialogs';
import Button from '@material-ui/core/Button';
import AppHeader from "./AppHeader";
import InCart from "../InCart";
import OrderTicketList from "./OrderTicketList";
import FiltersComponent from "./FiltersComponent";
import { DEPARTED_SCREEN_NAME, DELIVERED_SCREEN_NAME, RECOVERED_SCREEN_NAME, 
    UNIT_ROOM_BED_SORT_LABEL, UNIT_ROOM_BED_SORT, DELIVERY_DATE_TIME_SORT, 
    UNIT, SHOW_ALL_UNITS, DELIVERED, 
    NEXT_ACTION_CONFIRMATION, EMPTY_CART_DELETE_MESSAGE, ALL_TRAYS_DELIVERED, 
    NO_MORE_TRAYS, ADD_TRAYS_SCREEN_NAME, TIME_SINCE_DELIVERED_SORT_LABEL, 
    DELIVERY_TIME_SORT_LABEL, START_DELIVERING_TRAYS, RETURN_TO_DEPARTED, 
    ERROR_WHILE_DEPARTING_CART, ERROR_WHILE_DEPARTING_CART_MESSAGE, HIGH_RISK_TRAY_CHECK_SCREEN_NAME} from "../../redux/actions/Constants";
import {MARK_CART_CHECKED, ERROR_WHILE_HIGH_RISK_CHECK_TITLE, ERROR_WHILE_HIGH_RISK_CHECK_MESSAGE, 
    MARK_CART_DEPARTED } from '../../utils/ConstantsWithStyle';
import { Grid } from "@material-ui/core";
import {markCartChecked, hideErrorPopup} from '../../redux/actions/HighRiskTrayCheckAction';
class OrderListButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMealOrder: -1,
            isOpen: true,
            showConfirm: false,
            showHighRiskCheckConfirm: false,
            selectedUnit: -1,
            sortBy: '',
            openAddTrayPopup: false,
            isDeparted: this.props.screenName === DEPARTED_SCREEN_NAME,
            isDelivered: this.props.screenName === DELIVERED_SCREEN_NAME,
            isRecovered: this.props.screenName === RECOVERED_SCREEN_NAME,
            isHighRiskTrayCheck: this.props.screenName === HIGH_RISK_TRAY_CHECK_SCREEN_NAME,
        }
        this.removeTray = this.removeTray.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.markCartDeparted = this.markCartDeparted.bind(this);
        this.onAccept = this.onAccept.bind(this);
        this.hideConfirmation = this.hideConfirmation.bind(this);
        this.markTrayDelivered = this.markTrayDelivered.bind(this);
        this.onChangeFilters = this.onChangeFilters.bind(this);
        this.onAddTrays = this.onAddTrays.bind(this);
        this.returnSelectedOrder = this.returnSelectedOrder.bind(this);
        this.recoverTray = this.recoverTray.bind(this);
        this.onUndo = this.onUndo.bind(this);
        this.goToDeliveredSummary = this.goToDeliveredSummary.bind(this)
        this.goToDepartedScreen = this.goToDepartedScreen.bind(this)
        this.markCartChecked = this.markCartChecked.bind(this);
        this.onAcceptChecked = this.onAcceptChecked.bind(this);
    }
    handleClose() {
        this.props.closeDepartedSummary()
    };

    componentWillMount() {
        if (this.props.isRecovered) {
            this.props.fetchAllUnitsForSelectedKitchen(-1, -1)
            this.props.fetchTraysToRecover(-1, '', this.props.parentProps.isOffline)
        }
    }
    returnSelectedOrder(mealOrder, isUndoEnable) {
        if (!isUndoEnable)
        {
            if(this.props.isRecovered){
            if (this.props.selectedMealOrder && this.props.selectedMealOrder.id === mealOrder.id) {
                this.props.unselectMealOrder()
              }
              else {
                this.props.selectMealOrder(mealOrder);
              }
            } else {
                if (this.state.selectedMealOrder.id === mealOrder.id) {
                    this.setState({ selectedMealOrder: -1 });
                }
                else {
                    this.setState({ selectedMealOrder: mealOrder });
                }
            }
        }
    }

    removeTray() {
        if (this.state.selectedMealOrder === -1)
            console.log("Please select a tray to remove");
        else {
            this.props.removeTrayFromCart(this.props.selectedCart.id, this.props.selectedCart.zone,
                this.state.selectedMealOrder.id, this.props.parentProps.history, this.state.isDeparted, this.state.isHighRiskTrayCheck);
            this.setState({ selectedMealOrder: -1 })
        }
    }

    onAccept() {
        this.setState({ showConfirm: false, selectedMealOrder: -1})
        this.props.markCartDeparted(this.props.selectedCart);
    }

    onAcceptChecked() {
        this.setState({ showHighRiskCheckConfirm: false, selectedMealOrder: -1})
        this.props.markCartChecked(this.props.selectedCart, this.props.parentProps.history);
    }

    goToDeliveredSummary(){
        this.props.hideConfirmationPopup();
        this.setState({selectedMealOrder: -1})
		this.props.openDepartedCartSummary(this.props.selectedCart, this.props.parentProps.history, DELIVERED);
    }

    goToDepartedScreen(){
        this.props.hideConfirmationPopup();
		this.props.openReadyToDepart(this.props.parentProps.history)
    }

    hideConfirmation() { 
        this.setState({ showConfirm: false, showHighRiskCheckConfirm: false, showErrorWhileDeparting: false, selectedMealOrder: -1 });
    }

    markCartDeparted() {
        if (this.props.selectedCart.mealOrders && this.props.selectedCart.mealOrders.length > 0) {
            this.setState({ showConfirm: true });
        }
    }

    markCartChecked() {
        if (this.props.selectedCart.mealOrders && this.props.selectedCart.mealOrders.length > 0) {
            this.setState({ showHighRiskCheckConfirm: true });
        }
    }

    markTrayDelivered() {
        this.props.markTrayDelivered(this.state.selectedMealOrder, this.props.selectedCart, this.state.selectedUnit, this.state.sortBy);
        this.setState({ selectedMealOrder: -1 })
    }

    onAddTrays() {
        this.setState({ selectedMealOrder: -1, openAddTrayPopup: !this.state.openAddTrayPopup })
    }

    onChangeFilters(event) {
        if (event.target.name === UNIT) {
            var selectedUnit = parseInt(event.target.value)
            this.setState({ selectedUnit })
            if (this.props.isRecovered){
                this.props.fetchTraysToRecover(selectedUnit, this.state.sortBy, this.props.parentProps.isOffline);
            }
            else{
                this.setState({selectedMealOrder: -1})
                this.props.sortAndFilterTrays(this.props.selectedCart, selectedUnit, this.state.sortBy)
            }
        } else if (event.target.name === 'sort') {
            if(event.target.value!=="-1" ){
            this.setState({ sortBy: event.target.value, selectedMealOrder: -1 })
            if (this.props.isRecovered)
                this.props.fetchTraysToRecover(this.state.selectedUnit, event.target.value, this.props.parentProps.isOffline);
            else
                this.props.sortAndFilterTrays(this.props.selectedCart, this.state.selectedUnit, event.target.value)
        }
    }
    };

    recoverTray() {
        var selectedMealOrder = this.props.selectedMealOrder;
        if (selectedMealOrder === undefined || selectedMealOrder.id === undefined)
            console.log("Please select a tray to recover");
        else {
            this.props.recoverTray(this.props.parentProps.isOffline, this.props.selectedMealOrder.id, this.state.selectedUnit, this.state.sortBy);
        }
    }

    onUndo(mealOrder) {
        if(this.props.isRecovered)
        {
            this.props.undoRecoveredTray(this.props.parentProps.isOffline, mealOrder.id, this.state.selectedUnit, this.state.sortBy)
        } else if(this.props.isDelivered){
            this.props.undoDeliveredTray(this.props.selectedCart, mealOrder, this.state.selectedUnit, this.state.sortBy)
            this.setState({selectedMealOrder: -1})
        }
    }

    render() {
        if(this.props.isDelivered) {
            if(!this.props.units || this.props.units.length === 0){
                this.props.fetchAllUnitsForSelectedKitchen(-1, -1)
              }
        }
        var addTraysPopupScreen = <InCart screenName={ADD_TRAYS_SCREEN_NAME} cart={this.props.selectedCart} handleClose={this.onAddTrays}/>
        var selectedMealOrder = this.props.isRecovered ? this.props.selectedMealOrder : this.state.selectedMealOrder;
        var deliveryTimeSortLabel = this.props.isRecovered ? TIME_SINCE_DELIVERED_SORT_LABEL : DELIVERY_TIME_SORT_LABEL;
        var sortByArray = [{ id: DELIVERY_DATE_TIME_SORT, name: deliveryTimeSortLabel }, { id: UNIT_ROOM_BED_SORT, name: UNIT_ROOM_BED_SORT_LABEL }]
        var filters = [{ name: UNIT, value: this.state.selectedUnit, default: SHOW_ALL_UNITS, optionArray: this.props.units, class: 'unit-filter-first' } ,
        { showDefault: false, name: 'sort', value: this.state.sortBy, optionArray: sortByArray, class: this.props.isRecovered ? 'sort-by-filter': 'sort-by-filter-small' },
        ]
        const dialogContent = <div style={{margin: '27px', fontWeight: '500'}}>{ERROR_WHILE_DEPARTING_CART_MESSAGE}</div>
        const dialogTitle = <div style= {{color:'transparent'}}>{ERROR_WHILE_DEPARTING_CART}</div>
        return (
            <div className="container">
                {((this.props.isRecovered && this.props.loadingRecovered) || ( !this.props.isRecovered && this.props.loading))
                     && <div className="loader"><img alt="Loading. Please wait..." className="loading-gif" src={require("../../images/loading.gif")}/></div>}
                <AppHeader props={this.props.parentProps} showBack={this.props.showBack} title={this.props.screenName} />
                {this.props.isDeparted &&
                    <Grid className="depart-top">
    
    
                        <h4>Cart Summary<br/>Zone {this.props.selectedCart.zone}</h4>
                       <div className="depart-button">
                       
                            <Button variant="contained" color="primary"
                                className={this.props.selectedCart && this.props.selectedCart.mealOrders.length > 0 ? "cart-departed active" : "cart-departed"}
                                onClick={this.markCartDeparted}
                            >Mark Cart as Departed </Button>
                        
                    </div>
                    </Grid>
                    }
                    {this.props.isHighRiskTrayCheck &&
                    <Grid className="depart-top">
    
    
                        <h4>Cart Summary<br/>Zone {this.props.selectedCart.zone}</h4>
                       <div className="depart-button">
                       
                            <Button variant="contained" color="primary"
                                className={this.props.selectedCart && this.props.selectedCart.mealOrders.length > 0 ? "cart-departed active" : "cart-departed"}
                                onClick={this.markCartChecked}
                            >Cart Ready For Departure </Button>
                        
                    </div>
                    </Grid>
                    }
                <div className={this.props.isDeparted ? "width-auto text-center" : "width-auto"}>
                   
                    {
                        !this.props.isDeparted && !this.props.isHighRiskTrayCheck &&
                        <FiltersComponent filters={filters} onChange={(e) => this.onChangeFilters(e)} />
                    }

                    <div className={this.props.isDeparted ? "outer-style less-255" : "outer-style"}>
                        <div className="scroll">
                        { ((this.props.isRecovered && this.props.loadingRecovered) || ( !this.props.isRecovered && this.props.loading)) ?
                                null :
                            <OrderTicketList
                                emptyListMessage={this.props.isDeparted ? EMPTY_CART_DELETE_MESSAGE : (this.props.isDelivered ? ALL_TRAYS_DELIVERED : NO_MORE_TRAYS)}
                                handleClick={this.returnSelectedOrder} 
                                mealOrders={this.props.isRecovered ? this.props.traysToBeRecovered : this.props.isDelivered ? this.props.selectedCart.traysToBeDelivered : this.props.selectedCart.mealOrders}
                                selectedMealOrder={this.props.isRecovered ? this.props.selectedMealOrder : this.state.selectedMealOrder}
                                showDeliveryTime={this.props.isRecovered ? false : true}
                                isRecovered={this.props.isRecovered} />
                        }
                            {
                                !this.props.isDeparted &&
                              <div> { ((this.props.isRecovered && this.props.loadingRecovered) || ( !this.props.isRecovered && this.props.loading)) ?
                                null :  <OrderTicketList
                                    emptyListMessage=""
                                    handleClick={this.returnSelectedOrder}
                                    mealOrders={this.props.isRecovered ? this.props.recoveredTrays : this.props.selectedCart.deliveredTrays}
                                    showDeliveryTime={this.props.isRecovered ? false : true}
                                    isRecovered={this.props.isRecovered}
                                    onUndo={this.onUndo} />
                              }
                            </div>}
                            </div>
                        
                    </div>
                </div>
                <div className={(this.props.isDeparted || this.props.isHighRiskTrayCheck ) ? "width-330" : "width-330 top-20"}>
                    <div className={this.props.isDeparted ?
                        "cart-details less-255" : this.props.isHighRiskTrayCheck ? "cart-details middle" : "cart-details middle delivered"} >
                        {this.props.isDeparted &&
                            <div style={{ paddingTop: '57px' }} className="middle">
                                <div className={this.props.selectedCart.mealOrders
                                    && selectedMealOrder !== -1
                                    ? "btn-tray" : "btn-tray disabled"} color="primary"
                                    onClick={this.removeTray}>Remove Tray</div>
                                <div className={this.props.selectedCart && this.props.selectedCart.mealOrders && this.props.selectedCart.mealOrders.length > 0 ? "btn-tray" : "btn-tray disabled"}
                                    color="primary"
                                    onClick={this.onAddTrays}>Add Trays</div>
                            </div>
                        }
                        {this.props.isDelivered &&
                            <div className={this.props.selectedCart.mealOrders
                                && selectedMealOrder !== -1 ? "btn-tray" : "btn-tray disabled"} color="primary"
                                onClick={this.markTrayDelivered}>Tray Delivered</div>
                        }
                        {this.props.isRecovered &&
                            <div className={selectedMealOrder ? "btn-tray" : "btn-tray disabled"} color="primary" onClick={this.recoverTray}>Tray Recovered</div>
                        }
                        {this.props.isHighRiskTrayCheck &&
                            <div className={this.props.selectedCart.mealOrders
                                && selectedMealOrder !== -1 ? "btn-tray" : "btn-tray disabled"} color="primary"
                                onClick={this.removeTray}>Remove Tray</div>
                        }
                    </div>
                </div>
                {
                    this.state.showConfirm &&
                    <CustomizedDialogs dialogTitle="Confirm"
                        dialogContent={MARK_CART_DEPARTED}
                        open={this.state.showConfirm} showButtons={true}
                        onAccept={this.onAccept} handleClose={this.hideConfirmation}
                        showInfoMessage={false} />
                }
                {
                    this.state.showHighRiskCheckConfirm &&
                    <CustomizedDialogs dialogTitle="Confirm"
                        dialogContent={MARK_CART_CHECKED}
                        open={this.state.showHighRiskCheckConfirm} showButtons={true}
                        onAccept={this.onAcceptChecked} handleClose={this.hideConfirmation}
                        showInfoMessage={false} />
                }
                {
                    this.state.isDeparted && this.props.cartMarkedDepartedSuccessMessage &&
                    <CustomizedDialogs dialogTitle="Confirm"
                        dialogContent={NEXT_ACTION_CONFIRMATION}
                        open={this.props.cartMarkedDepartedSuccessMessage} 
                        showButtons={true}
                        acceptBtn={START_DELIVERING_TRAYS}
                        rejectBtn={RETURN_TO_DEPARTED}
                        onAccept={this.goToDeliveredSummary} 
                        handleClose={this.goToDepartedScreen} />
                }
                { 
                    this.state.isDeparted && this.props.errorWhileDepartingMessage &&
                    <CustomizedDialogs dialogTitle={dialogTitle}
                        customClassName = "popup-xsm-width"
                        dialogContent={dialogContent}
                        open={this.props.errorWhileDepartingMessage} 
                        showButtons={false}
                        showOnlyOkButton={true}
                        handleClose={this.props.hideConfirmationPopup} />
                }
                { 
                    this.state.isHighRiskTrayCheck && this.props.errorWhileHighRiskChecking &&
                    <CustomizedDialogs dialogTitle={ERROR_WHILE_HIGH_RISK_CHECK_TITLE}
                        customClassName = "popup-xsm-width"
                        dialogContent={ERROR_WHILE_HIGH_RISK_CHECK_MESSAGE}
                        open={this.props.errorWhileHighRiskChecking} 
                        showButtons={false}
                        showOnlyOkButton={true}
                        handleClose={this.props.hideErrorPopup} />
                }
                {
                    this.state.openAddTrayPopup &&
                    <CustomizedDialogs dialogTitle="Add Trays"
                        fullScreen={true}
                        dialogContent={addTraysPopupScreen}
                        handleClose={this.onAddTrays}
                        open={this.state.openAddTrayPopup}
                        showBackButton={true} />
                }

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        traysToBeRecovered: state.recoverReducer.traysToBeRecovered,
        selectedMealOrder: state.inCartReducer.selectedMealOrder,
        recoveredTrays: state.recoverReducer.recoveredTrays,
        units: state.inCartReducer.units,
        cartMarkedDepartedSuccessMessage: state.departReducer.cartMarkedDepartedSuccessMessage,
        errorWhileDepartingMessage: state.departReducer.errorWhileDepartingMessage,
        loading: state.loader.loading,
        loadingRecovered: state.loader.loadingRecovered,
        errorWhileHighRiskChecking: state.highRiskTrayCheckReducer.errorWhileHighRiskChecking,
    }
}
const mapDispatchToProps = {
    removeTrayFromCart,
    markCartDeparted,
    markTrayDelivered,
    fetchAllUnitsForSelectedKitchen,
    fetchTraysToRecover,
    recoverTray,
    selectMealOrder,
    unselectMealOrder,
    undoRecoveredTray,
    undoDeliveredTray,
    sortAndFilterTrays,
    openDepartedCartSummary,
    openReadyToDepart,
    hideConfirmationPopup,
    markCartChecked,
    hideErrorPopup,
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderListButton);