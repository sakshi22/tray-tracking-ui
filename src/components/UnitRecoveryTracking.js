import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchFacilityMealNameArrayForSelectedFacility } from '../redux/actions/InCartAction';
import {
    fetchKitchensWithUnitTrackingEnabled,
    markUnitForTracking,
    fetchRecoveryUnits,
    updateSelectedKitchenForUnitRecovery,
    resetUnitDeliveryFailureParameters,
    undoUnitTracking,
} from '../redux/actions/UnitTrackingAction'
import { SHOW_ALL_BUILD_AREAS, BUILD_AREA, BEDSIDE, ERROR_WHILE_RECOVERING_UNIT_MESSAGE, ERROR_WHILE_UNDO_RECOVERING_UNIT_MESSAGE, UNIT_RECOVERY_TRACKING, TAP_MEAL_TO_SELECT_UNIT_RECOVERED, NO_MORE_UNITS_RECOVERED, ERROR_WHILE_RECOVERING_UNIT, ERROR_WHILE_UNDO_RECOVERING_UNIT, MARK_RECOVERED } from "../redux/actions/Constants";
import UnitTrackingUI from "./sharedComponents/UnitTrackingUI";

class UnitRecoveryTracking extends Component {
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
        this.props.updateSelectedKitchenForUnitRecovery(this.props.selectedKitchenRecovered ? this.props.selectedKitchenRecovered : -1);
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
            console.log("Please select a unit to recover");
        else {
            this.props.markUnitForTracking(this.state.selectedUnit, this.state.currentMealId, this.props.selectedKitchenRecovered, false);
            this.setState({ selectedUnit: -1 })
        }
    }

    fetchUnits(kitchenId, mealNameId) {
        if (mealNameId !== -1) {
            this.props.fetchRecoveryUnits(kitchenId, mealNameId);
            this.setState({ selectedUnit: -1 })
        }
    }

    onChangeFilters(event) {
        if (event.target.name === BUILD_AREA) {
            var selectedKitchen = parseInt(event.target.value)
            this.props.updateSelectedKitchenForUnitRecovery(selectedKitchen)
            this.fetchUnits(selectedKitchen, this.state.currentMealId)
        }
    }

    onUndo(unit) {
        this.props.undoUnitTracking(unit, this.state.currentMealId, this.props.selectedKitchenRecovered, false)
        this.setState({ selectedUnit: -1 })
    }

    closeErrorPopup() {
        this.props.resetUnitDeliveryFailureParameters();
    }

    onSelectMealName(selectedMealName) {
        if (this.state.currentMealId !== selectedMealName) {
            this.setState({ currentMealId: selectedMealName })
            this.fetchUnits(this.props.selectedKitchenRecovered, selectedMealName)
        }
    }

    render() {
        var filters = [
            { name: BUILD_AREA, value: this.props.selectedKitchenRecovered, default: SHOW_ALL_BUILD_AREAS, optionArray: this.props.kitchens },
        ];
        const errorDialogContent = <div style={{ margin: '27px' }}>{this.props.deliveredFail ?
            ERROR_WHILE_RECOVERING_UNIT_MESSAGE
            : ERROR_WHILE_UNDO_RECOVERING_UNIT_MESSAGE}</div>
        return (
            <UnitTrackingUI
                props={this.props}
                loading={this.props.loading || (this.props.loadingUnitRecovery)}
                title={UNIT_RECOVERY_TRACKING}
                currentMealId={this.state.currentMealId}
                isFacilityMealNameArrayAvailable={this.props.facilityMealNameArray && this.props.facilityMealNameArray.length > 0}
                facilityMealNameArray={this.props.facilityMealNameArray}
                filters={filters}
                unitList={this.props.deliveredUnits}
                selectUnit={this.returnSelectedUnit}
                undoUnit={this.onUndo}
                undoUnitList={this.props.recoveredUnits}
                emptyUnitListMessage={NO_MORE_UNITS_RECOVERED}
                selectedUnit={this.state.selectedUnit}
                markUnitForTracking={this.markUnitForTracking}
                buttonTitle={MARK_RECOVERED}
                deliveredFail={this.props.deliveredFail}
                undoDeliveredFail={this.props.undoDeliveredFail}
                errorDialogTitle={this.props.deliveredFail ? ERROR_WHILE_RECOVERING_UNIT
                    : ERROR_WHILE_UNDO_RECOVERING_UNIT}
                errorDialogContent={errorDialogContent}
                closeErrorPopup={this.closeErrorPopup}
                onSelectMealName={this.onSelectMealName}
                onChangeFilters={this.onChangeFilters}
                selectMealMessage={TAP_MEAL_TO_SELECT_UNIT_RECOVERED}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        kitchens: state.inCartReducer.kitchens,
        facilityMealNameArray: state.inCartReducer.facilityMealNameArray,
        deliveredUnits: state.unitTrackingReducer.deliveredUnits,
        recoveredUnits: state.unitTrackingReducer.recoveredUnits,
        undoDeliveredFail: state.unitTrackingReducer.undoDeliveredFail,
        deliveredFail: state.unitTrackingReducer.deliveredFail,
        selectedKitchenRecovered: state.unitTrackingReducer.selectedKitchenRecovered,
        loading: state.loader.loading,
        loadingUnitRecovery: state.loader.loadingUnitRecovery,
    }
}
const mapDispatchToProps = {
    markUnitForTracking,
    undoUnitTracking,
    fetchRecoveryUnits,
    resetUnitDeliveryFailureParameters,
    fetchKitchensWithUnitTrackingEnabled,
    fetchFacilityMealNameArrayForSelectedFacility,
    updateSelectedKitchenForUnitRecovery,
}

export default connect(mapStateToProps, mapDispatchToProps)(UnitRecoveryTracking);