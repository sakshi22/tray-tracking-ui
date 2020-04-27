import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchFacilityMealNameArrayForSelectedFacility } from '../redux/actions/InCartAction';
import {
    fetchKitchensWithUnitTrackingEnabled,
    markUnitForTracking,
    fetchDeliveryUnits,
    updateSelectedKitchenForUnitDelivery,
    resetUnitDeliveryFailureParameters,
    undoUnitTracking,
} from '../redux/actions/UnitTrackingAction'
import { NO_MORE_UNITS_DELIVERED, SHOW_ALL_BUILD_AREAS, BUILD_AREA, BEDSIDE, ERROR_WHILE_DELIVERING_UNIT, ERROR_WHILE_UNDO_DELIVERING_UNIT, ERROR_WHILE_UNDO_DELIVERING_UNIT_MESSAGE, ERROR_WHILE_DELIVERING_UNIT_MESSAGE, MARK_DELIVERED, TAP_MEAL_TO_SELECT_UNIT_DELIVERED, UNIT_DELIVERY_TRACKING } from "../redux/actions/Constants";
import UnitTrackingUI from "./sharedComponents/UnitTrackingUI";

class UnitDeliveryTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUnit: -1,
            currentMealId: -1,
        }
        this.markUnitForTracking = this.markUnitForTracking.bind(this);
        this.onChangeFilters = this.onChangeFilters.bind(this);
        this.returnSelectedUnit = this.returnSelectedUnit.bind(this);
        this.onUndo = this.onUndo.bind(this);
        this.closeErrorPopup = this.closeErrorPopup.bind(this);
        this.onSelectMealName = this.onSelectMealName.bind(this);
    }

    componentWillMount() {
        this.props.fetchKitchensWithUnitTrackingEnabled()
        this.props.fetchFacilityMealNameArrayForSelectedFacility();
        this.props.updateSelectedKitchenForUnitDelivery(this.props.selectedKitchenDelivered ? this.props.selectedKitchenDelivered : -1);
    }
    returnSelectedUnit(unit, isUndoEnable) {
        if (!isUndoEnable) {
            if (this.state.selectedUnit.id === unit.id) {
                this.setState({ selectedUnit: -1 });
            }
            else {
                this.setState({ selectedUnit: unit });
            }
        }
    }

    markUnitForTracking() {
        if (this.state.selectedUnit === -1)
            console.log("Please select a unit to deliver/ recover");
        else {
            this.props.markUnitForTracking(this.state.selectedUnit, this.state.currentMealId, this.props.selectedKitchenDelivered, true);
            this.setState({ selectedUnit: -1 })
        }
    }

    fetchUnits(kitchenId, mealNameId) {
        if (mealNameId !== -1) {
            this.props.fetchDeliveryUnits(kitchenId, mealNameId);
            this.setState({ selectedUnit: -1 })
        }
    }

    onChangeFilters(event) {
        if (event.target.name === BUILD_AREA) {
            var selectedKitchen = parseInt(event.target.value)
            this.props.updateSelectedKitchenForUnitDelivery(selectedKitchen)
            this.fetchUnits(selectedKitchen, this.state.currentMealId)
        }
    }

    onUndo(unit) {
        this.props.undoUnitTracking(unit, this.state.currentMealId, this.props.selectedKitchenDelivered, true)
        this.setState({ selectedUnit: -1 })
    }

    closeErrorPopup() {
        this.props.resetUnitDeliveryFailureParameters();
    }

    onSelectMealName(selectedMealName) {
        if (this.state.currentMealId !== selectedMealName) {
            this.setState({ currentMealId: selectedMealName })
            this.fetchUnits(this.props.selectedKitchenDelivered, selectedMealName)
        }
    }

    render() {
        var filters = [
            { name: BUILD_AREA, value: this.props.selectedKitchenDelivered, default: SHOW_ALL_BUILD_AREAS, optionArray: this.props.kitchens },
        ];
        const errorDialogContent = <div style={{ margin: '27px' }}>{this.props.deliveredFail ?
            ERROR_WHILE_DELIVERING_UNIT_MESSAGE : ERROR_WHILE_UNDO_DELIVERING_UNIT_MESSAGE }</div>
        return (
            <UnitTrackingUI
                props = {this.props}
                loading = {this.props.loading || this.props.loadingUnitDelivery}
                title = {UNIT_DELIVERY_TRACKING}
                currentMealId = {this.state.currentMealId}
                isFacilityMealNameArrayAvailable = {this.props.facilityMealNameArray && this.props.facilityMealNameArray.length > 0}
                facilityMealNameArray = {this.props.facilityMealNameArray}
                filters = {filters}
                unitList = {this.props.unitsToDeliver}
                selectUnit = {this.returnSelectedUnit}
                undoUnit = {this.onUndo}
                undoUnitList = {this.props.deliveredUnits}
                emptyUnitListMessage = {NO_MORE_UNITS_DELIVERED}
                selectedUnit = {this.state.selectedUnit}
                markUnitForTracking = {this.markUnitForTracking}
                buttonTitle = {MARK_DELIVERED}
                deliveredFail = {this.props.deliveredFail}
                undoDeliveredFail = {this.props.undoDeliveredFail}
                errorDialogTitle = {this.props.deliveredFail ? ERROR_WHILE_DELIVERING_UNIT
                     : ERROR_WHILE_UNDO_DELIVERING_UNIT}
                errorDialogContent = {errorDialogContent}
                closeErrorPopup = {this.closeErrorPopup}
                onSelectMealName = {this.onSelectMealName}
                onChangeFilters = {this.onChangeFilters}
                selectMealMessage = {TAP_MEAL_TO_SELECT_UNIT_DELIVERED}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        kitchens: state.inCartReducer.kitchens,
        facilityMealNameArray: state.inCartReducer.facilityMealNameArray,
        unitsToDeliver: state.unitTrackingReducer.unitsToDeliver,
        deliveredUnits: state.unitTrackingReducer.deliveredUnits,
        undoDeliveredFail: state.unitTrackingReducer.undoDeliveredFail,
        deliveredFail: state.unitTrackingReducer.deliveredFail,
        selectedKitchenDelivered: state.unitTrackingReducer.selectedKitchenDelivered,
        loading: state.loader.loading,
        loadingUnitDelivery: state.loader.loadingUnitDelivery,
    }
}
const mapDispatchToProps = {
    markUnitForTracking,
    fetchDeliveryUnits,
    undoUnitTracking,
    resetUnitDeliveryFailureParameters,
    fetchKitchensWithUnitTrackingEnabled,
    fetchFacilityMealNameArrayForSelectedFacility,
    updateSelectedKitchenForUnitDelivery,
}

export default connect(mapStateToProps, mapDispatchToProps)(UnitDeliveryTracking);