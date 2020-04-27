import React from "react";
import CustomizedDialogs from "./CustomizedDialogs";
import AppHeader from "./AppHeader";
import FiltersComponent from "./FiltersComponent";
import UnitComponentList from "./UnitComponentList";

const UnitTrackingUI = (props) => {
  return (
    <div className="container">
                {props.loading
                    && <div className="loader">
                        <img alt="Loading. Please wait..." className="loading-gif" src={require("../../images/loading.gif")} />
                    </div>}
                <AppHeader props={props.props} title={props.title} />
                <div className="width-auto">
                    <div>
                        <span style={{ float: "left", marginLeft: '20px' }}>
                            <div className={props.currentMealId === 1 ? "meal-name-button active" : "meal-name-button"} onClick={(e) => props.onSelectMealName(1)}>
                                <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} className="meal-name-button-text">{props.isFacilityMealNameArrayAvailable ? (props.facilityMealNameArray[1]).name : ""}</div>
                            </div>
                            <div className={props.currentMealId === 3 ? "meal-name-button active" : "meal-name-button"} onClick={(e) => props.onSelectMealName(3)}>
                                <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} className="meal-name-button-text">{props.isFacilityMealNameArrayAvailable ? (props.facilityMealNameArray[2]).name : ""}</div>
                            </div>
                            <div className={props.currentMealId === 5 ? "meal-name-button active" : "meal-name-button"} onClick={(e) => props.onSelectMealName(5)}>
                                <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} className="meal-name-button-text">{props.isFacilityMealNameArrayAvailable ? (props.facilityMealNameArray[3]).name : ""}</div>
                            </div>
                        </span>
                        <span style={{ float: "right", marginRight: '-20px' }}>
                            <FiltersComponent menuClass="select-menu-unit-delivery" filters={props.filters} onChange={(e) => props.onChangeFilters(e)} />
                        </span>
                    </div>
                    <div className="outer-style">
                        {props.currentMealId === -1 ?
                            <div>{props.selectMealMessage}</div> :
                            <div className="scroll">
                                <UnitComponentList
                                    emptyListMessage={props.emptyUnitListMessage}
                                    handleClick={props.selectUnit}
                                    units={props.unitList}
                                    selectedUnit={props.selectedUnit} />
                                <div>
                                    <UnitComponentList
                                        emptyListMessage=""
                                        handleClick={props.selectUnit}
                                        units={props.undoUnitList}
                                        onUndo={props.undoUnit}
                                        enableUndo={true} />
                                </div>
                            </div>}
                    </div>
                </div>
                <div className="width-330 top-20">
                    <div className="cart-details middle delivered" >
                        <div style={{width: props.isRecovered ? '160px' : 'inherit'}} className={props.selectedUnit && props.selectedUnit.id ? "btn-tray" : "btn-tray disabled"}
                            color="primary" onClick={props.markUnitForTracking}>{props.buttonTitle}</div>
                    </div>
                </div>
                {
                    (props.deliveredFail || props.undoDeliveredFail) &&
                    <CustomizedDialogs dialogTitle={props.errorDialogTitle}
                        dialogContent={props.errorDialogContent}
                        open={props.deliveredFail || props.undoDeliveredFail}
                        onAccept={props.closeErrorPopup} handleClose={props.closeErrorPopup} />
                }


            </div>
  );
}
export default UnitTrackingUI;